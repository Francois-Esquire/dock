import stream from 'stream';
import React from 'react';
import { renderToString, renderToStaticNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import Application from '../components/Application';

class Markup {
  constructor() {
    this.createRenderStream = this.createRenderStream.bind(this);
  }
  // eslint-disable-next-line
  createRenderStream(html) {
    const body = new stream.Transform({
      transform(chunk, encoding, callback) {
        callback(undefined, chunk);
      },
    });

    body.write('<!DOCTYPE html>');

    return renderToStaticNodeStream(html).pipe(body);
  }

  error(ctx, error) {
    // eslint-disable-next-line no-param-reassign
    ctx.status = error.code || (error.code = 500);

    const html = (
      <html lang="en-US">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="Content-Language" content="en" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Oops - {error.code}</title>
        </head>
        <body>
          <p>We{"'"}re sorry, looks like there was an issue...</p>

          <p>{error.message}</p>
        </body>
      </html>
    );

    return this.createRenderStream(html);
  }

  async render(ctx) {
    const app = renderToString(
      <StaticRouter location={ctx.path} context={(ctx.state = ctx.state || {})}>
        <Application />
      </StaticRouter>,
    );

    if (typeof ctx.state.status === 'number') ctx.status = ctx.state.status;
    else ctx.status = 200;

    const html = (
      <html lang="en-US">
        <head>
          <meta charSet="utf-8" />
          <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
          <meta httpEquiv="Content-Language" content="en" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>Discover Your Passion</title>

          {/* css */}
          {process.env.NODE_ENV === 'production' && (
            <link rel="stylesheet" href="/css/main.css" />
          )}
        </head>
        <body>
          {/* eslint-disable-next-line react/no-danger */}
          <div id="app" dangerouslySetInnerHTML={{ __html: app }} />

          {/* js */}
          <script type="text/javascript" src="/js/vendors~main.js" />
          <script type="text/javascript" src="/js/main.js" />
        </body>
      </html>
    );

    return this.createRenderStream(html);
  }
}

export default new Markup();
