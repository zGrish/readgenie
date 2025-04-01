import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';
import FilterBar from '../components/FilterBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { getTrendingBooks, getBooksBySubject } from '../utils/api';

export default function Home() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  useEffect(() => {
    async function fetchBooks() {
      setLoading(true);
      setError(null);
      
      try {
        let fetchedBooks;
        
        if (activeFilter === 'all') {
          fetchedBooks = await getTrendingBooks();
        } else {
          fetchedBooks = await getBooksBySubject(activeFilter);
        }
        
        setBooks(fetchedBooks);
      } catch (err) {
        console.error('Error fetching books:', err);
        setError('Failed to load books. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBooks();
  }, [activeFilter]);

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <Layout title="ReadGenie | Discover Your Next Book">
      <div className="container">
        <div className="hero">
          <h1>Discover Your Next Book</h1>
          <p>Find new books to love and track your favorites with ReadGenie</p>
          <SearchBar />
        </div>
        
        <FilterBar activeFilter={activeFilter} onFilterChange={handleFilterChange} />
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <BookGrid 
            books={books} 
            title={activeFilter === 'all' ? 'Trending Books' : `${activeFilter.split('_').map(word => 
              word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ')} Books`} 
          />
        )}
      </div>
      
      <style jsx>{`
        .hero {
          text-align: center;
          margin-bottom: 2rem;
          padding: 3rem 1rem;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
        }
        
        .hero h1 {
          font-size: 2.5rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        .hero p {
          font-size: 1.2rem;
          color: var(--dark-gray);
          margin-bottom: 2rem;
        }
        
        .error-message {
          padding: 1rem;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
          text-align: center;
        }
        
        @media (max-width: 768px) {
          .hero {
            padding: 2rem 1rem;
          }
          
          .hero h1 {
            font-size: 2rem;
          }
          
          .hero p {
            font-size: 1rem;
          }
        }
      `}</style>
    </Layout>
  );
}