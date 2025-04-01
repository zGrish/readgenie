import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import FavoriteButton from './FavoriteButton';
import styles from '../styles/RelatedBooks.module.css';

function RelatedBooks({ books }) {
  if (!books || books.length === 0) {
    return null;
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>You May Also Like</h2>
      <div className={styles.relatedBooks}>
        {books.map((book) => {
          const bookKey = book.key.replace(/^\/works\//, '');
          return (
            <div key={book.key} className={styles.relatedBook}>
              <Link href={`/book/${bookKey}`} className={styles.bookLink}>
                <div className={styles.imageContainer}>
                  {book.coverUrl ? (
                    <Image
                      src={book.coverUrl}
                      alt={`Cover for ${book.title}`}
                      width={100}
                      height={150}
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
                  <h3 className={styles.bookTitle}>{book.title}</h3>
                  <p className={styles.bookAuthor}>
                    {Array.isArray(book.authors) ? book.authors.join(', ') : book.authors}
                  </p>
                </div>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RelatedBooks;