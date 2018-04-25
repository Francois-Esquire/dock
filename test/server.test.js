import test from 'ava';
import stream from 'stream';
import request from 'supertest';

import app from '../src/server/app';
import render from '../src/www';

const server = app.callback();

test('App: headers', async t => {
  const response = await request(server).get('/');

  const { headers } = response;

  t.is(headers['content-type'], 'text/html');
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
      bufs.push(d.toString());
    });

    readable.on('end', () => {
      resolve(bufs.join(''));
    });

    html.pipe(readable);
  });

  t.plan(3);

  t.is(response.status, 200);
  t.is(response.type, 'text/html');
  t.is(response.text, markup);
});
