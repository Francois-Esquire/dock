import ApolloClient from 'apollo-client';

import cache from './cache';
import link from './link';

if (window.__$$__) cache.restore(window.__$$__);

const client = new ApolloClient({
  link,
  cache,
});

export default client;
