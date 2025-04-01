import { createContext, useState, useContext, useEffect } from 'react';

const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([]);
  
  // Load favorites from localStorage on initial mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem('readgenie-favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (error) {
        console.error('Error parsing favorites from localStorage:', error);
        localStorage.removeItem('readgenie-favorites');
      }
    }
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('readgenie-favorites', JSON.stringify(favorites));
  }, [favorites]);

  // Add a book to favorites
  const addFavorite = (book) => {
    setFavorites((prevFavorites) => {
      // Check if the book is already in favorites
      if (prevFavorites.some((favBook) => favBook.key === book.key)) {
        return prevFavorites;
      }
      return [...prevFavorites, book];
    });
  };

  // Remove a book from favorites
  const removeFavorite = (bookKey) => {
    setFavorites((prevFavorites) => 
      prevFavorites.filter((book) => book.key !== bookKey)
    );
  };

  // Check if a book is in favorites
  const isFavorite = (bookKey) => {
    return favorites.some((book) => book.key === bookKey);
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

// Custom hook to use the favorites context
export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}