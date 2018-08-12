import { makeExecutableSchema } from 'graphql-tools';

import defs from './definitions';

import resolvers from './resolvers';

const schema = makeExecutableSchema({
  typeDefs: [defs],
  resolvers,
});

export default schema;
