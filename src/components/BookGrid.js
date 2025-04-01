import React from 'react';
import BookCard from './BookCard';
import styles from '../styles/BookGrid.module.css';

function BookGrid({ books, title }) {
  if (!books || books.length === 0) {
    return (
      <div className={styles.emptyState}>
        <h2>No books found</h2>
        <p>Try adjusting your search or explore our trending books.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {title && <h2 className={styles.sectionTitle}>{title}</h2>}
      <div className={styles.grid}>
        {books.map((book) => (
          <div key={book.key} className={styles.gridItem}>
            <BookCard book={book} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BookGrid;