import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/SearchBar.module.css';

function SearchBar({ initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSubmit}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Search for books by title, author, or keyword..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

export default SearchBar;