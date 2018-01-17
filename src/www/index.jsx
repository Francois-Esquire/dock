// eslint-disable-next-line
import '@babel/polyfill';
import React from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';

import Application from './Application';

export default async function render(ctx) {
  const app = (
    <StaticRouter location={ctx.path} context={ctx}>
      <Application />
    </StaticRouter>
  );

  const html = (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta httpEquiv="Content-Language" content="en" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Shiva</title>
      </head>
      <body>
        <div id="app" dangerouslySetInnerHTML={{ __html: renderToString(app) }} />
      </body>
    </html>
  );

  const body = `<!DOCTYPE html>${
    renderToStaticMarkup(html)
  }`;

  return body;
}
