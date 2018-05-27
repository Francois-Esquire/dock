// eslint-disable-next-line import/no-extraneous-dependencies
// import '@babel/polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Application from '../components/Application';

const supportsHistory = 'pushState' in window.history;

const appElement = document.getElementById('app');

ReactDOM.hydrate(
  <BrowserRouter forceRefresh={!supportsHistory}>
    <Application />
  </BrowserRouter>,
  appElement,
);
