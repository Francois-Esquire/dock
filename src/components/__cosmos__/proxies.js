/*
  eslint
    import/no-extraneous-dependencies: 0
*/

import createRouterProxy from 'react-cosmos-router-proxy';

const RouterProxy = createRouterProxy();

const proxies = [RouterProxy];

export default proxies;
