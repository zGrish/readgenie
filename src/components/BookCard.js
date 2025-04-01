import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import FavoriteButton from './FavoriteButton';
import styles from '../styles/BookCard.module.css';

function BookCard({ book }) {
  const authors = Array.isArray(book.authors) ? book.authors.join(', ') : book.authors;
  const bookKey = book.key.replace(/^\/works\//, '');
  
  return (
    <div className={styles.bookCard}>
      <Link href={`/book/${bookKey}`} className={styles.bookLink}>
        <div className={styles.imageContainer}>
          {book.coverUrl ? (
            <Image
              src={book.coverUrl}
              alt={`Cover for ${book.title}`}
              width={200}
              height={300}
              className={styles.coverImage}
            />
          ) : (
            <div className={styles.placeholderCover}>
              <span>{book.title.substring(0, 1)}</span>
            </div>
          )}
          <FavoriteButton book={book} />
        </div>
        <div className={styles.bookInfo}>
          <h3 className={styles.title}>{book.title}</h3>
          <p className={styles.author}>{authors}</p>
          <p className={styles.year}>{book.firstPublishYear}</p>
        </div>
      </Link>
    </div>
  );
}

export default BookCard;