import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import '../styles/main.scss';

import Application from './Application';

const supportsHistory = 'pushState' in window.history;

const appElement = document.getElementById('app');

ReactDOM.hydrate(
  <BrowserRouter forceRefresh={!supportsHistory}>
    <Application />
  </BrowserRouter>,
  appElement,
);
