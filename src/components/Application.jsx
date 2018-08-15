import React from 'react';

import Toaster from './Toaster';
import Modal from './Modal';

import Layout from './layouts/Main';

class Application extends React.PureComponent {
  // eslint-disable-next-line class-methods-use-this
  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }

  render() {
    // declare all contexts that the app requires.
    return (
      <Toaster>
        <Modal>
          <Layout />
        </Modal>
      </Toaster>
    );
  }
}

if (process.env.NODE_ENV !== 'production' && process.env.SERVER === false) {
  // eslint-disable-next-line global-require, import/no-extraneous-dependencies
  const { hot } = require('react-hot-loader');
  // eslint-disable-next-line no-class-assign
  Application = hot(module)(Application);
}

export default Application;
