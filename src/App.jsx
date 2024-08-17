import  { useState } from 'react';
import useDebounce from './hooks/useDebounce';
import useFetchData from './hooks/useFetchData';
import {UserCard}  from './components/UserCard';
import {EmailList}  from './components/EmailList';

const App = () => {
  const [query, setQuery] = useState('');
  const [techQuery, setTechQuery] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(30);

  const debouncedQuery = useDebounce(query, 1000);
  const debouncedTechQuery = useDebounce(techQuery, 1000);

  const { users, loading, error, fetchData } = useFetchData();



  const handleItemsPerPageChange = (event) => {
    const value = parseInt(event.target.value, 10);
    setItemsPerPage(value);
    setCurrentPage(1); 
  };

  return (
    <div className="App">
      <h1>GitHub User Search</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, email, or username"
      />
      <input
        type="text"
        value={techQuery}
        onChange={(e) => setTechQuery(e.target.value)}
        placeholder="Filter by technology"
      />
      <select onChange={(e) => setUserTypeFilter(e.target.value)} value={userTypeFilter}>
        <option value="">All Types</option>
        <option value="User">User</option>
        <option value="Organization">Organization</option>
      </select>
      <select onChange={handleItemsPerPageChange} value={itemsPerPage}>
        <option value={10}>10 per page</option>
        <option value={30}>30 per page</option>
        <option value={50}>50 per page</option>
        <option value={100}>100 per page</option>
      </select>
      <button
        onClick={() => fetchData(debouncedQuery, debouncedTechQuery, currentPage, itemsPerPage, userTypeFilter)}
        disabled={loading}
      >
        {loading ? 'Searching...' : 'Search'}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <EmailList users={users} />
      <ul>
        {users.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </ul>
    </div>
  );
};

export default App;
