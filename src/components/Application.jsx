import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import styles from './styles/app.scss';

import Home from './pages/Home';

function Application() {
  return (
    <main className={styles.main}>
      <Switch>
        <Route component={Home} />
      </Switch>
    </main>
  );
}

// eslint-disable-next-line import/no-mutable-exports
let App = withRouter(Application);

if (process.env.NODE_ENV !== 'production' && process.env.SERVER === false) {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { hot } = require('react-hot-loader');

  App = hot(module)(App);
}

export default App;
