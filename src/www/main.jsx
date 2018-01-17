import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Application from './Application';

const supportsHistory = 'pushState' in window.history;

const appElement = document.getElementById('app');

if (process.env.NODE_ENV !== 'production') {
  // eslint-disable-next-line import/no-extraneous-dependencies, global-require
  const { AppContainer } = require('react-hot-loader');

  const renderApp = (App = Application) => {
    const app = (
      <AppContainer>
        <BrowserRouter forceRefresh={!supportsHistory}>
          <App />
        </BrowserRouter>
      </AppContainer>
    );

    ReactDOM.hydrate(app, appElement);
  };

  if (module && module.hot) {
    module.hot.accept('./Application', () => {
      // eslint-disable-next-line global-require
      const App = require('./Application').default;
      renderApp(App);
    });
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
