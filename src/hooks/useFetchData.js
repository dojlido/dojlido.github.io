import { useState } from 'react';
import { fetchRepositories, fetchUserDetails, fetchUsers } from '../services/api/gitHubApi';

const CACHE_EXPIRY_TIME = 1000 * 60 * 60; // 1 hour
const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL;

const useFetchData = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchData = async (searchQuery, tech, page = 1, perPage = 30, filter = '') => {
    setLoading(true);
    setError('');

    const cacheKey = `github-users-${searchQuery}-${tech}-${page}-${perPage}-${filter}`;
    const cacheTimestampKey = `${cacheKey}-timestamp`;
    const cachedData = localStorage.getItem(cacheKey);
    const cacheTimestamp = localStorage.getItem(cacheTimestampKey);

    if (cachedData && cacheTimestamp && Date.now() - parseInt(cacheTimestamp, 10) < CACHE_EXPIRY_TIME) {
      setUsers(JSON.parse(cachedData));
      setLoading(false);
      return;
    }

    try {
      let usersWithStars = [];

      if (tech) {
        const repos = await fetchRepositories(tech, perPage);
        const userSet = new Set(repos.map((repo) => repo.owner.login));
        const userPromises = [...userSet].map(async (login) => {
          const userDetails = await fetchUserDetails(`${GITHUB_API_URL}/users/${login}`);
          const userRepos = await fetchUserDetails(userDetails.repos_url);

          const totalStars = userRepos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

          return { ...userDetails, totalStars };
        });

        usersWithStars = await Promise.all(userPromises);
      } else {
        const userData = await fetchUsers(searchQuery, perPage);
        const userPromises = userData.map(async (user) => {
          const userDetails = await fetchUserDetails(user.url);
          const repos = await fetchUserDetails(user.repos_url);

          const totalStars = repos.reduce((acc, repo) => acc + repo.stargazers_count, 0);

          const socialLinks = [];
          if (userDetails.bio) {
            const bioLinks = userDetails.bio.match(/https?:\/\/[^\s]+/g);
            if (bioLinks) socialLinks.push(...bioLinks);
          }
          if (userDetails.blog) {
            socialLinks.push(userDetails.blog);
          }

          return {
            ...user,
            name: userDetails.name || 'No name available',
            email: userDetails.email || 'No email available',
            totalStars,
            socialLinks,
          };
        });

        usersWithStars = await Promise.all(userPromises);
      }

      usersWithStars.sort((a, b) => b.totalStars - a.totalStars);

      if (filter) {
        usersWithStars = usersWithStars.filter((user) => user.type === filter);
      }

      const startIndex = (page - 1) * perPage;
      const endIndex = startIndex + perPage;
      const paginatedUsers = usersWithStars.slice(startIndex, endIndex);

      localStorage.setItem(cacheKey, JSON.stringify(paginatedUsers));
      localStorage.setItem(cacheTimestampKey, Date.now().toString());

      setUsers(paginatedUsers);
    } catch (err) {
      setError(err?.response?.data?.errors?.[0]?.message || 'An error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, fetchData };
};

export default useFetchData;
