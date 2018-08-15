import React from 'react';

import client from '../../www/client';

import * as mutationDocuments from '../../schema/documents/mutations';

const mutations = Object.keys(mutationDocuments).reduce(
  function mutationFactory(map, next) {
    // eslint-disable-next-line no-param-reassign
    map[next] = function mutationSignature(options = {}) {
      return client.mutate({
        ...options,
        mutation: mutationDocuments[next],
      });
    };

    return map;
  },
  Object.create(null),
);

const { Consumer } = React.createContext(mutations);

export default Consumer;
