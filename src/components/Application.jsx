import React from 'react';

import styles from './styles/app.scss';

import Root from './pages/Root';

class Application extends React.PureComponent {
  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    return (
      <main className={styles.main}>
        <Root />
      </main>
    );
  }
}

if (process.env.NODE_ENV !== 'production' && process.env.SERVER === false) {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { hot } = require('react-hot-loader');
  // eslint-disable-next-line no-class-assign
  Application = hot(module)(Application);
}

export default Application;
