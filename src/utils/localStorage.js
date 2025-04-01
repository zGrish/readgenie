// Check if code is running in browser environment
const isBrowser = typeof window !== 'undefined';

export const loadFavorites = () => {
  if (!isBrowser) return [];
  
  try {
    const savedFavorites = localStorage.getItem('readgenie_favorites');
    return savedFavorites ? JSON.parse(savedFavorites) : [];
  } catch (error) {
    console.error('Error loading favorites from localStorage:', error);
    return [];
  }
};

export const saveFavorites = (favorites) => {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem('readgenie_favorites', JSON.stringify(favorites));
  } catch (error) {
    console.error('Error saving favorites to localStorage:', error);
  }
};