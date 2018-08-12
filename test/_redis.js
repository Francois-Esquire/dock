import RedisMock from 'redmock';

class RedisMockServer {
  constructor() {
    this.server = new RedisMock();

    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
  }

  async start() {
    await this.server.start();
  }

  async stop() {
    await this.server.stop();
  }
}

export default new RedisMockServer();
