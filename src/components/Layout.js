import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import styles from '../styles/Layout.module.css';

function Layout({ children, title = 'ReadGenie - Book Recommendations' }) {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="ReadGenie - Find your next favorite book" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.layout}>
        <Navbar />
        <main className={styles.main}>{children}</main>
        <footer className={styles.footer}>
          <div className={styles.footerContent}>
            <p>&copy; {new Date().getFullYear()} ReadGenie - All rights reserved</p>
          </div>
        </footer>
      </div>
    </>
  );
}

export default Layout;