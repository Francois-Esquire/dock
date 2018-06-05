import React from 'react';

import styles from './styles/home.scss';

import Button from '../primitives/Button';

import simoneHutschScrape from '../../../static/simone-hutsch-scrape.jpg';

export default function Home() {
  return (
    <article className={styles.article}>
      <header className={styles.header}>
        <h1 className={styles.h1}>
          <span className={styles.span}>Find Your Obsession</span>
          <br />
          <span className={styles.span}>Discover Your Passion</span>
        </h1>
      </header>

      <img className={styles.img} src={simoneHutschScrape} alt="blue skies" />

      <footer className={styles.footer}>
        <Button className={styles.button}>Explore Now</Button>
      </footer>
    </article>
  );
}
