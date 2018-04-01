import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import Home from '../components/pages/Home';

function Application() {
  return (
    <main>
      <Switch>
        <Route component={Home} />
      </Switch>
    </main>
  );
}

// eslint-disable-next-line import/no-mutable-exports
let App = withRouter(Application);

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { hot } = require('react-hot-loader');

  App = hot(module)(App);
}

export default App;
