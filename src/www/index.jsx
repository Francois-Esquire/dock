import stream from 'stream';
import React from 'react';
import { renderToString, renderToStaticNodeStream } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom';
import { ApolloProvider, getDataFromTree } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { SchemaLink } from 'apollo-link-schema';

import Application from '../components/Application';

import schema from '../schema';

class Markup {
  constructor() {
    this.createRenderStream = this.createRenderStream.bind(this);

    const link = new SchemaLink({ schema, context: null, rootValue: null });

    const cache = new InMemoryCache();

    this.client = new ApolloClient({ ssrMode: true, link, cache });
  }

  // eslint-disable-next-line class-methods-use-this
  createRenderStream(html) {
    const body = new stream.Transform({
      transform(chunk, encoding, callback) {
        callback(undefined, chunk);
      },
    });

    body.write('<!DOCTYPE html>');

    return renderToStaticNodeStream(html).pipe(body);
  }

  // eslint-disable-next-line class-methods-use-this
  // createLocalClient(schema) {
  //   const link = new SchemaLink({ schema });

  //   const cache = new InMemoryCache();

  //   const client = new ApolloClient({ ssrMode: true, link, cache });

  //   console.log(schema);

  //   return client;
  // }

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
    const { client } = this;
    // const client = this.createLocalClient(ctx.schema);

    // reset with every request.
    client.cache.reset();

    // link schema with current context.
    client.link = new SchemaLink({
      schema,
      context: ctx,
      rootValue: ctx.state,
    });

    const _ = (
      <ApolloProvider client={client}>
        <StaticRouter
          location={ctx.path}
          context={(ctx.state = ctx.state || {})}
        >
          <Application />
        </StaticRouter>
      </ApolloProvider>
    );

    await getDataFromTree(_);

    const state = {
      __$$__: client.extract(),
    };

    const app = renderToString(_);

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

          <script // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{
              __html: Object.keys(state).map(
                key =>
                  `window.${key}=${JSON.stringify(state[key]).replace(
                    /</g,
                    '\\u003c',
                  )};`,
              ),
            }}
          />

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
