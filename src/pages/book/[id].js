import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../../components/Layout';
import FavoriteButton from '../../components/FavoriteButton';
import RelatedBooks from '../../components/RelatedBooks';
import LoadingSpinner from '../../components/LoadingSpinner';
import { getBookDetails } from '../../utils/api';

export default function BookDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchBookDetails() {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const bookData = await getBookDetails(`/works/${id}`);
        setBook(bookData);
      } catch (err) {
        console.error('Error fetching book details:', err);
        setError('Failed to load book details. Please try again later.');
      } finally {
        setLoading(false);
      }
    }
    
    fetchBookDetails();
  }, [id]);

  if (loading) {
    return (
      <Layout title="Loading... | ReadGenie">
        <div className="container">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Error | ReadGenie">
        <div className="container">
          <div className="error-message">
            <h2>Error</h2>
            <p>{error}</p>
            <button className="btn" onClick={() => router.back()}>
              Go Back
            </button>
          </div>
        </div>
        
        <style jsx>{`
          .error-message {
            text-align: center;
            padding: 3rem 1rem;
            background-color: var(--white);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow);
          }
          
          .error-message h2 {
            color: #721c24;
            margin-bottom: 1rem;
          }
          
          .error-message p {
            margin-bottom: 2rem;
          }
        `}</style>
      </Layout>
    );
  }

  if (!book) {
    return null;
  }

  return (
    <Layout title={`${book.title} | ReadGenie`}>
      <div className="container">
        <div className="book-detail">
          <div className="book-header">
            <div className="cover-container">
              {book.coverUrl ? (
                <Image
                  src={book.coverUrl}
                  alt={`Cover for ${book.title}`}
                  width={300}
                  height={450}
                  className="cover-image"
                />
              ) : (
                <div className="placeholder-cover">
                  <span>{book.title.substring(0, 1)}</span>
                </div>
              )}
              <div className="favorite-button-container">
                <FavoriteButton book={book} />
              </div>
            </div>
            
            <div className="book-info">
              <h1 className="book-title">{book.title}</h1>
              
              <div className="book-meta">
                <p className="publish-date">
                  <strong>Published:</strong> {book.publishDate}
                </p>
                
                {book.authorDetails && book.authorDetails.length > 0 && (
                  <div className="authors">
                    <strong>By:</strong> {book.authorDetails.map(author => author.name).join(', ')}
                  </div>
                )}
                
                {book.rating > 0 && (
                  <div className="rating">
                    <strong>Rating:</strong> {book.rating.toFixed(1)} / 5
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span 
                          key={star} 
                          className={`star ${star <= Math.round(book.rating) ? 'filled' : ''}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {book.subjects && book.subjects.length > 0 && (
                  <div className="genres">
                    <strong>Genres:</strong>
                    <div className="genre-tags">
                      {book.subjects.slice(0, 5).map((subject, index) => (
                        <span key={index} className="genre-tag">
                          {subject}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="description">
                <h2>Description</h2>
                <div className="description-text">
                  {typeof book.description === 'string' 
                    ? book.description 
                    : 'No description available'}
                </div>
              </div>
            </div>
          </div>
          
          {book.authorDetails && book.authorDetails.length > 0 && (
            <div className="author-section">
              <h2>About the Author{book.authorDetails.length > 1 ? 's' : ''}</h2>
              {book.authorDetails.map((author) => (
                <div key={author.key} className="author-info">
                  <h3>{author.name}</h3>
                  <p>{author.bio}</p>
                </div>
              ))}
            </div>
          )}
          
          {book.relatedBooks && book.relatedBooks.length > 0 && (
            <RelatedBooks books={book.relatedBooks} />
          )}
        </div>
      </div>
      
      <style jsx>{`
        .book-detail {
          background-color: var(--white);
          border-radius: var(--border-radius);
          box-shadow: var(--shadow);
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .book-header {
          display: flex;
          gap: 2rem;
          margin-bottom: 3rem;
        }
        
        .cover-container {
          position: relative;
          flex-shrink: 0;
          width: 300px;
          height: 450px;
          border-radius: var(--border-radius);
          overflow: hidden;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }
        
        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .placeholder-cover {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--primary-color);
          color: var(--white);
        }
        
        .placeholder-cover span {
          font-size: 5rem;
          font-weight: bold;
        }
        
        .favorite-button-container {
          position: absolute;
          top: 10px;
          right: 10px;
        }
        
        .book-title {
          font-size: 2.2rem;
          margin-bottom: 1.5rem;
          color: var(--primary-color);
        }
        
        .book-meta {
          margin-bottom: 2rem;
        }
        
        .book-meta > * {
          margin-bottom: 1rem;
        }
        
        .rating {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .stars {
          display: flex;
          margin-left: 0.5rem;
        }
        
        .star {
          color: var(--medium-gray);
          font-size: 1.2rem;
        }
        
        .star.filled {
          color: var(--secondary-color);
        }
        
        .genres {
          margin-top: 1rem;
        }
        
        .genre-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          margin-top: 0.5rem;
        }
        
        .genre-tag {
          background-color: var(--light-gray);
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          font-size: 0.9rem;
        }
        
        .description h2 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
          color: var(--primary-color);
        }
        
        .description-text {
          line-height: 1.8;
          white-space: pre-line;
        }
        
        .author-section {
          margin-top: 3rem;
          padding-top: 2rem;
          border-top: 1px solid var(--medium-gray);
        }
        
        .author-section h2 {
          font-size: 1.5rem;
          margin-bottom: 1.5rem;
          color: var(--primary-color);
        }
        
        .author-info {
          margin-bottom: 2rem;
        }
        
        .author-info h3 {
          font-size: 1.2rem;
          margin-bottom: 0.5rem;
          color: var(--text-color);
        }
        
        .author-info p {
          line-height: 1.6;
        }
        
        @media (max-width: 768px) {
          .book-header {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          
          .cover-container {
            width: 220px;
            height: 330px;
            margin-bottom: 2rem;
          }
          
          .book-title {
            font-size: 1.8rem;
          }
          
          .genre-tags {
            justify-content: center;
          }
          
          .book-detail {
            padding: 1.5rem;
          }
        }
      `}</style>
    </Layout>
  );
}