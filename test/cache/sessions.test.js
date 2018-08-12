import test from 'ava';

// import server from '../_redis';

import redis from './redis';
import sessions from './Cache';

// test.before(server.start);
// test.after.always(server.stop);

const key = 'user1';

test.serial('Session:set', async t => {
  const session = {
    loggedIn: true,
  };

  await sessions.set(key, session);

  t.deepEqual(session, await sessions.get(key));
});

test.serial('Session:delete', async t => {
  await sessions.delete(key);

  t.false(await sessions.has(key));
});
