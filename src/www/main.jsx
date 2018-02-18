import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Application from './Application';

const supportsHistory = 'pushState' in window.history;

const appElement = document.getElementById('app');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const { AppContainer } = require('react-hot-loader');

  // eslint-disable-next-line no-inner-declarations
  function renderApp(App = Application) {
    const app = (
      <AppContainer>
        <BrowserRouter forceRefresh={!supportsHistory}>
          <App />
        </BrowserRouter>
      </AppContainer>
    );

    ReactDOM.hydrate(app, appElement);
  }

  // eslint-disable-next-line no-inner-declarations
  function hotAppReload() {
    // eslint-disable-next-line global-require
    const App = require('./Application').default;
    renderApp(App);
  }

  if (module && module.hot) {
    module.hot.accept('./Application', hotAppReload);
  }

  renderApp();
} else {
  const app = (
    <BrowserRouter forceRefresh={!supportsHistory}>
      <Application />
    </BrowserRouter>
  );

  ReactDOM.hydrate(app, appElement);
}
