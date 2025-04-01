import React from 'react';
import styles from '../styles/FilterBar.module.css';

function FilterBar({ activeFilter, onFilterChange }) {
  const genres = [
    'all',
    'fiction',
    'fantasy',
    'science_fiction',
    'mystery',
    'romance',
    'historical',
    'biography',
    'science',
    'philosophy'
  ];

  return (
    <div className={styles.filterBar}>
      <h3 className={styles.filterTitle}>Browse by Genre</h3>
      <div className={styles.filters}>
        {genres.map((genre) => (
          <button
            key={genre}
            className={`${styles.filterButton} ${activeFilter === genre ? styles.active : ''}`}
            onClick={() => onFilterChange(genre)}
          >
            {genre === 'all' ? 'All' : genre.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')}
          </button>
        ))}
      </div>
    </div>
  );
}

export default FilterBar;