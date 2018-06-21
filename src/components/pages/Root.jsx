import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import Home from './Home';
import NotFound from './404';

class Router extends React.PureComponent {
  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    return (
      <Switch>
        <Route exact path="/" component={Home} />

        <Route component={NotFound} />
      </Switch>
    );
  }
}

const Root = withRouter(Router);

export default Root;
