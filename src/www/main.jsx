// eslint-disable-next-line import/no-extraneous-dependencies
// import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';

import client from './client';

import Application from '../components/Application';

const supportsHistory = 'pushState' in window.history;

const appElement = document.getElementById('app');

const app = (
  <ApolloProvider client={client}>
    <BrowserRouter forceRefresh={!supportsHistory}>
      <Application />
    </BrowserRouter>
  </ApolloProvider>
);

ReactDOM.hydrate(app, appElement);
