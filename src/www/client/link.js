import { createHttpLink } from 'apollo-link-http';

const uri = '/graphql';

const link = createHttpLink({
  uri,
});

export default link;
