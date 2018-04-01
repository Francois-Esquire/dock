import test from 'ava';
import stream from 'stream';
import request from 'supertest';
import { log } from 'util';

import app from '../src/server/app';
import render from '../src/www';

const server = app.callback();

test('App: headers', async t => {
  const response = await request(server).get('/');

  const { headers } = response;

  log(headers);

  t.pass();
});

test('App: route /*', async t => {
  const path = '/';

  const response = await request(server).get(path);
  const html = await render({ path });

  const markup = await new Promise(resolve => {
    const bufs = [];
    const readable = new stream.Transform({
      transform(chunk, encoding, callback) {
        callback(undefined, chunk);
      },
    });

    readable.on('data', d => {
      bufs.push(d);
    });

    readable.on('end', () => {
      resolve(bufs.reduce((mkp, next) => mkp + next.toString(), ''));
    });

    html.pipe(readable);
  });

  t.plan(3);

  t.is(response.status, 200);
  t.is(response.type, 'text/html');
  t.is(response.text, markup);
});
