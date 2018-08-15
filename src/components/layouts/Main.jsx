import React from 'react';

import styles from './styles/main.scss';

import Header from './Header';
import Footer from './Footer';

import Root from '../pages/Root';

export default function MainLayout() {
  return (
    <main className={styles.main}>
      <Header />

      <Root />

      <Footer />
    </main>
  );
}
