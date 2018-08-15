import React from 'react';
import { Query } from 'react-apollo';

import { queryMe } from '../../schema/documents/queries';

export default function QueryMe({ children }) {
  return <Query query={queryMe}>{children}</Query>;
}
