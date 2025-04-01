import React from 'react';
import { useFavorites } from '../context/FavoritesContext';
import styles from '../styles/FavoriteButton.module.css';

function FavoriteButton({ book }) {
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const isBookmarked = isFavorite(book.key);

  const toggleFavorite = () => {
    if (isBookmarked) {
      removeFavorite(book.key);
    } else {
      addFavorite(book);
    }
  };

  return (
    <button 
      className={`${styles.favoriteButton} ${isBookmarked ? styles.active : ''}`}
      onClick={toggleFavorite}
      aria-label={isBookmarked ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 24 24" 
        fill={isBookmarked ? 'currentColor' : 'none'}
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
      </svg>
    </button>
  );
}

export default FavoriteButton;