import React from 'react';

import { withRouter, Switch, Route } from 'react-router-dom';

import Home from './Home';

function Router() {
  return (
    <Switch>
      <Route component={Home} />
    </Switch>
  );
}

const Root = withRouter(Router);

export default Root;
