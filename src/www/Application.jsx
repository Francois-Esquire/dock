import React from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';

import Home from './pages/Home';

function Application() {
  return (
    <main>
      <Switch>
        <Route component={Home} />
      </Switch>
    </main>
  );
}

const App = withRouter(Application);

export default App;
