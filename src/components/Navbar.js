import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import styles from '../styles/Navbar.module.css';

function Navbar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.logo}>
          ReadGenie
        </Link>
        
        <div className={styles.hamburger} onClick={toggleMobileMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        <div className={`${styles.navLinks} ${mobileMenuOpen ? styles.active : ''}`}>
          <Link href="/" className={router.pathname === '/' ? styles.active : ''}>
            Home
          </Link>
          <Link href="/favorites" className={router.pathname === '/favorites' ? styles.active : ''}>
            Favorites
          </Link>
          
          <form className={styles.searchForm} onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search books..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit">Search</button>
          </form>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;