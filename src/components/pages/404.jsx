import React from 'react';
import { Link } from 'react-router-dom';

import styles from './styles/404.scss';

export default function NotFound(props) {
  // eslint-disable-next-line
  if (props.staticContext) props.staticContext.status = 404;

  return (
    <section className={styles.notfound}>
      <header>
        <h1>Sorry</h1>
      </header>

      <p>Looks like we couldn{"'"}t find what you were looking for.</p>

      <footer>
        <Link to="/">Go Back Home</Link>
      </footer>
    </section>
  );
}
