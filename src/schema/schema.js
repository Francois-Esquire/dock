import { makeExecutableSchema } from 'graphql-tools';

import defs from './definitions/schema.graphql';

import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs: [defs],
  resolvers,
});

export default schema;
