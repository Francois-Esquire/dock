import React from 'react';

import Button from '../../components/Button';

const styles = {
  article: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexFlow: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    overflow: 'scroll',
    fontFamily: 'futura',
  },
  header: {
    zIndex: 2,
    minHeight: '400px',
    padding: '4em',
  },
  h1: {
    textAlign: 'center',
    fontSize: '2em',
    color: '#fff',
  },
  span: {
    padding: '1em',
  },
  img: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: '100vw',
    zIndex: 1,
    overflow: 'scroll',
  },
  footer: {
    display: 'flex',
    flexFlow: 'row',
    justifyContent: 'center',
    zIndex: 2,
    padding: '2em',
  },
  button: {
    fontFamily: 'futura',
    fontSize: '3em',
    background: 'none',
    color: '#fff',
    backgroundColor: 'transparent',
    border: '2px solid #fff',
    borderRadius: 4,
    margin: 'auto',
    padding: '2em',
  },
};

export default function Home() {
  return (
    <article style={styles.article}>
      <header style={styles.header}>
        <h1 style={styles.h1}>
          <span style={styles.span}>Find Your Obsession</span>
          <br />
          <span style={styles.span}>Discover Your Passion</span>
        </h1>
      </header>

      <img
        style={styles.img}
        src="assets/simone-hutsch-scrape.jpg"
        alt="blue skies"
      />

      <footer style={styles.footer}>
        <Button style={styles.button}>Explore Now</Button>
      </footer>
    </article>
  );
}
