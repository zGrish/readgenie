import React from 'react';
import styles from '../styles/LoadingSpinner.module.css';

function LoadingSpinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}

export default LoadingSpinner;