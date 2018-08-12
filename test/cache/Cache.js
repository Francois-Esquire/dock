import redis from './redis';

class SessionCache {
  constructor(options = {}) {
    const { key = 'sessions', expiry = 60 * 60 * 24 * 31 } = options;

    this.sessionKey = key;
    this.expiry = expiry;
  }

  async has(key) {
    const { sessionKey } = this;

    const result = await redis.hexists(sessionKey, key);

    return !!result;
  }

  async get(key) {
    const { sessionKey } = this;

    const result = await redis.hget(sessionKey, key);

    return JSON.parse(result);
  }

  async set(key, value) {
    const { sessionKey } = this;

    if (typeof value !== 'string') {
      // serialize value if necessary
      // eslint-disable-next-line no-param-reassign
      value = JSON.stringify(value);
    }

    const result = await redis.hset(sessionKey, key, value);

    return result;
  }

  async delete(key) {
    const { sessionKey } = this;

    const result = await redis.hdel(sessionKey, key);

    return result;
  }
}

export default new SessionCache();
