import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import BookGrid from '../components/BookGrid';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import { searchBooks } from '../utils/api';

export default function Search() {
  const router = useRouter();
  const { q } = router.query;
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalResults, setTotalResults] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchSearchResults() {
      if (!q) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const results = await searchBooks(q, currentPage);
        setBooks(results.books);
        setTotalResults(results.numFound);
        setTotalPages(Math.ceil(results.numFound / 20));
      } catch (err) {
        console.error('Error searching books:', err);
        setError('Failed to search books. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchSearchResults();
    // Reset to first page when search query changes
    if (q) {
      setCurrentPage(1);
    }
  }, [q, currentPage]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      // Scroll to top when changing pages
      window.scrollTo(0, 0);
    }
  };

  return (
    <Layout title={`Search: ${q || ''} | ReadGenie`}>
      <div className="container">
        <div className="search-header">
          <h1>Search Results</h1>
          <SearchBar initialQuery={q || ''} />
        </div>
        
        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}
        
        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            {books.length > 0 ? (
              <>
                <div className="results-info">
                  <p>Found {totalResults.toLocaleString()} results for "{q}"</p>
                  <p>Page {currentPage} of {totalPages}</p>
                </div>
                <BookGrid books={books} />
                
                {totalPages > 1 && (
                  <div className="pagination">
                    <button 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="page-button"
                    >
                      Previous
                    </button>
                    
                    <div className="page-numbers">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum;
                        
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (currentPage <= 3) {
                          pageNum = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNum}
                            onClick={() => handlePageChange(pageNum)}
                            className={`page-number ${currentPage === pageNum ? 'active' : ''}`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                      
                      {totalPages > 5 && currentPage < totalPages - 2 && (
                        <>
                          <span className="page-ellipsis">...</span>
                          <button
                            onClick={() => handlePageChange(totalPages)}
                            className="page-number"
                          >
                            {totalPages}
                          </button>
                        </>
                      )}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="page-button"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="no-results">
                <h2>No results found</h2>
                <p>We couldn't find any books matching "{q}".</p>
                <p>Try adjusting your search terms or browse our trending books.</p>
                <button 
                  onClick={() => router.push('/')}
                  className="browse-button"
                >
                  Browse Trending Books
                </button>
              </div>
            )}
          </>
        )}
      </div>
      
      <style jsx>{`
        .search-header {
          margin-bottom: 2rem;
          padding: 2rem;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
        }
        
        .search-header h1 {
          font-size: 2rem;
          margin-bottom: 1.5rem;
          color: var(--primary-color);
        }
        
        .results-info {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1.5rem;
          padding: 1rem;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          font-size: 0.9rem;
          color: var(--dark-gray);
        }
        
        .error-message {
          padding: 1rem;
          background-color: #f8d7da;
          color: #721c24;
          border-radius: var(--border-radius);
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 2rem;
          padding: 1rem;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
        }
        
        .page-button {
          padding: 0.5rem 1rem;
          background-color: var(--primary-color);
          color: var(--white);
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .page-button:disabled {
          background-color: var(--medium-gray);
          cursor: not-allowed;
        }
        
        .page-button:hover:not(:disabled) {
          background-color: #14255d;
        }
        
        .page-numbers {
          display: flex;
          align-items: center;
          margin: 0 1rem;
        }
        
        .page-number {
          width: 2.5rem;
          height: 2.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 0.2rem;
          background-color: var(--light-gray);
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .page-number:hover {
          background-color: var(--medium-gray);
        }
        
        .page-number.active {
          background-color: var(--primary-color);
          color: var(--white);
        }
        
        .page-ellipsis {
          margin: 0 0.5rem;
        }
        
        .no-results {
          text-align: center;
          padding: 3rem 1rem;
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
        }
        
        .no-results h2 {
          color: var(--primary-color);
          margin-bottom: 1rem;
        }
        
        .no-results p {
          color: var(--dark-gray);
          margin-bottom: 1rem;
        }
        
        .browse-button {
          margin-top: 1rem;
          padding: 0.8rem 1.5rem;
          background-color: var(--primary-color);
          color: var(--white);
          border: none;
          border-radius: var(--border-radius);
          cursor: pointer;
          transition: var(--transition);
        }
        
        .browse-button:hover {
          background-color: #14255d;
        }
        
        @media (max-width: 768px) {
          .results-info {
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .pagination {
            flex-wrap: wrap;
            gap: 1rem;
          }
        }
      `}</style>
    </Layout>
  );
}