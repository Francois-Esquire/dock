import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';

import Application from './Application';

const appElement = document.getElementById('app');

ReactDOM.hydrate(
  (
    <BrowserRouter>
      <Application />
    </BrowserRouter>
  ), appElement,
);
