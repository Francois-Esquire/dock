/*
  eslint
    class-methods-use-this: 0
*/
import fs from 'fs';
import { execute } from 'graphql';

import _mongo from './_mongo';

import schema from '../src/schema';

class SchemaTestEnvironment {
  constructor() {
    this.schema = schema;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.execute = this.execute.bind(this);

    // this.mutations = fs.readdirSync(
    //   `${process.cwd}/src/schema/documents/mutations`,
    // );
    // // .map(s => s.toString())
    // // .filter(s => s.endsWith('.gql'));

    // console.log(this.mutations);
  }

  async start() {
    await _mongo.start();
  }

  async stop() {
    await _mongo.stop();
  }

  execute(doc, params = {}) {
    // const { schema } = this;

    const { variables, rootValue, context } = params;

    return execute(schema, doc, rootValue, context, variables);
  }
}

export default new SchemaTestEnvironment();
