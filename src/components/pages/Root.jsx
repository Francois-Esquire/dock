import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import Home from './Home';
import Login from './Login';
import Signup from './Signup';
import Profile from './Profile';
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

        <Route path="/login" component={Login} />
        <Route path="/signup" component={Signup} />

        <Route path="/me" component={Profile} />

        <Route component={NotFound} />
      </Switch>
    );
  }
}

const Root = withRouter(Router);

export default Root;
