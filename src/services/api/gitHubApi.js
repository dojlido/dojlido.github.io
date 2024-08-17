import axios from 'axios';

const GITHUB_API_URL = import.meta.env.VITE_GITHUB_API_URL;
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

const fetchRepositories = async (tech, itemsPerPage) => {
  const response = await axios.get(`${GITHUB_API_URL}/search/repositories?q=language:${tech}&per_page=${itemsPerPage}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });
  return response.data.items;
};

const fetchUserDetails = async (url) => {
  const response = await axios.get(url, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });
  return response.data;
};

const fetchUsers = async (query, itemsPerPage) => {
  const response = await axios.get(`${GITHUB_API_URL}/search/users?q=${query}&per_page=${itemsPerPage}`, {
    headers: {
      Authorization: `token ${GITHUB_TOKEN}`,
    },
  });
  return response.data.items;
};

export { fetchRepositories, fetchUserDetails, fetchUsers };
