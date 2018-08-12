import test from 'ava';
import stream from 'stream';
import request from 'supertest';

import app from '../../src/server/app';
import markup from '../../src/www';

const server = app.callback();

test('App: checklist default headers', async t => {
  const response = await request(server).get('/');

  const { headers } = response;

  t.plan(Object.keys(headers).length);

  // TODO:
  // Caching headers
  // CSP headers

  const checklist = [
    // GENERAL
    { header: 'date', exists: true },
    { header: 'response-time', exists: true },
    { header: 'connection', value: 'close' },
    { header: 'transfer-encoding', value: 'chunked' },
    // CONTENT DESCRIPTION
    { header: 'content-type', value: 'text/html' },
    { header: 'content-encoding', value: 'gzip' },
    // CACHE
    { header: 'vary', value: 'Origin, Accept-Encoding' },
    { header: 'x-dns-prefetch-control', value: 'off' },
    // SECURITY
    {
      // only valid over https, ignored on http
      header: 'strict-transport-security',
      value: 'max-age=15552000; includeSubDomains',
    },
    { header: 'x-frame-options', value: 'SAMEORIGIN' },
    { header: 'x-xss-protection', value: '1; mode=block' },
    // SECURITY / IE8
    { header: 'x-download-options', value: 'noopen' },
    { header: 'x-content-type-options', value: 'nosniff' },
  ];

  checklist.forEach(({ header, value, exists }) => {
    switch (true) {
      default:
        throw new Error('An Assertion Pair Is Required');
      case typeof value === 'string':
        t.is(headers[header], value);
        break;
      case typeof exists === 'boolean':
        t.true(typeof headers[header] === 'string');
        break;
    }
  });
});

test('App: route /*', async t => {
  const path = '/';

  const response = await request(server).get(path);
  const html = await markup.render({ path });

  const _markup = await new Promise(resolve => {
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
  t.is(response.text, _markup);
});
