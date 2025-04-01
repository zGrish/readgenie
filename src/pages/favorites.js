import React, { useContext } from 'react';
import Layout from '../components/Layout';
import BookGrid from '../components/BookGrid';
import { FavoritesContext } from '../context/FavoritesContext';

export default function Favorites() {
  const { favorites } = useContext(FavoritesContext);
  
  return (
    <Layout title="My Favorites | ReadGenie">
      <div className="container">
        <div className="favorites-header">
          <h1>My Favorites</h1>
          <p>Books you've marked as favorites</p>
        </div>
        
        {favorites.length === 0 ? (
          <div className="empty-favorites">
            <h2>No Favorites Yet</h2>
            <p>When you find books you love, add them to your favorites for easy access later.</p>
            <a href="/" className="btn">
              Discover Books
            </a>
          </div>
        ) : (
          <BookGrid books={favorites} />
        )}
      </div>
      
      <style jsx>{`
        .favorites-header {
          background-color: var(--white);
          padding: 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .favorites-header h1 {
          font-size: 2rem;
          color: var(--primary-color);
          margin-bottom: 0.5rem;
        }
        
        .favorites-header p {
          color: var(--dark-gray);
          font-size: 1.1rem;
        }
        
        .empty-favorites {
          background-color: var(--white);
          padding: 3rem 2rem;
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          text-align: center;
        }
        
        .empty-favorites h2 {
          font-size: 1.5rem;
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .empty-favorites p {
          color: var(--dark-gray);
          margin-bottom: 2rem;
          max-width: 500px;
          margin-left: auto;
          margin-right: auto;
        }
        
        .btn {
          display: inline-block;
          background-color: var(--primary-color);
          color: var(--white);
          padding: 0.8rem 1.5rem;
          border-radius: var(--border-radius);
          font-weight: 500;
          text-decoration: none;
          transition: var(--transition);
        }
        
        .btn:hover {
          background-color: #14255d;
        }
        
        @media (max-width: 768px) {
          .favorites-header {
            padding: 1.5rem;
          }
          
          .favorites-header h1 {
            font-size: 1.8rem;
          }
          
          .empty-favorites {
            padding: 2rem 1rem;
          }
        }
      `}</style>
    </Layout>
  );
}