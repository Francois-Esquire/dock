import KoaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';
import { graphqlKoa, graphiqlKoa } from 'apollo-server-koa';

import createContext from './context';
import createRootValue from './root';

import { formatError } from './format';

const graphql = new KoaRouter();

const graphqlEndpoint = '/graphql';

const bodyParser = koaBodyParser({
  extendTypes: {
    json: ['application/graphql'],
  },
});

export const _graphql = graphqlKoa(async function graph(ctx) {
  const { schema } = ctx;

  const context = await createContext(ctx);
  const rootValue = await createRootValue(ctx);

  return {
    schema,
    context,
    rootValue,
    formatError,
    formatResponse(response) {
      // handle session here
      // console.log(response);

      return response;
    },
  };
});

export const _graphiql =
  // process.env.NODE_ENV !== 'production'
  true
    ? graphiqlKoa({
        endpointURL: graphqlEndpoint,
      })
    : null;

graphql
  .post(graphqlEndpoint, bodyParser, _graphql)
  .get(graphqlEndpoint, bodyParser, _graphql);

if (_graphiql) graphql.get('/graphiql', _graphiql);

export default graphql;
