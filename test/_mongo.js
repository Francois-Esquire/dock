import MongodbMemoryServer from 'mongodb-memory-server';
import mongoose from 'mongoose';

import * as models from '../src/models';

class MongoTestEnvironment {
  constructor() {
    this.server = new MongodbMemoryServer();

    this.models = models;

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  async start() {
    const uri = await this.server.getConnectionString();

    this.connection = await mongoose.connect(
      uri,
      { useNewUrlParser: true },
    );
  }

  async stop() {
    if (this.connection) await this.connection.disconnect();
    await this.server.stop();
  }
}

export default new MongoTestEnvironment();
