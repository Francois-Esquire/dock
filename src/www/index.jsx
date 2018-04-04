import stream from 'stream';
import React from 'react';
import { renderToNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import Application from '../components/Application';

export default async function render(ctx) {
  const app = (
    <StaticRouter location={ctx.path} context={ctx}>
      <Application />
    </StaticRouter>
  );

  const html = (
    <html lang="en-US">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Discover Your Passion</title>

        {/* css */}
        {global.webpack ? null : <link rel="stylesheet" href="css/main.css" />}
      </head>
      <body>
        <div id="app">{app}</div>

        {/* js */}
        <script type="text/javascript" src="js/vendors~main.js" />
        <script type="text/javascript" src="js/main.js" />
      </body>
    </html>
  );

  const body = new stream.Transform({
    transform(chunk, encoding, callback) {
      callback(undefined, chunk);
    },
  });

  body.write('<!DOCTYPE html>');

  renderToNodeStream(html).pipe(body);

  return body;
}
