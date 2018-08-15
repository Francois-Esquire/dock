import React from 'react';

import styles from './styles/profile.scss';

export default function ProfileView(props) {
  const { me } = props;

  return (
    <article className={styles.profile}>
      <header>
        <h2>{me.handle}</h2>
        {/* add ability to change handle */}
      </header>
    </article>
  );
}
