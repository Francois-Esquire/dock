import Koa from 'koa';
import koaHelmet from 'koa-helmet';
import koaSession from 'koa-session';
import koaUserAgent from 'koa-useragent';
import koaCompress from 'koa-compress';
import koaCors from '@koa/cors';

import www from './www';

import { catcher, responseTime, statics } from './middleware';

const app = new Koa();

app
  .use(catcher)
  .use(responseTime)
  .use(
    koaCors({
      allowMethods: ['HEAD', 'GET', 'POST'],
      credentials: true,
      keepHeadersOnError: true,
    }),
  )
  .use(koaHelmet())
  .use(koaUserAgent)
  .use(
    koaSession(
      {
        maxAge: 60 * 60 * 24 * 31 * 1000,
        httpOnly: true,
        signed: true,
        key: '$$',
        // domain: `.${domain}`,
      },
      app,
    ),
  )
  .use(koaCompress());

if (global.webpack) {
  app.use(global.webpack);
}

app
  .use(statics)
  .use(www.allowedMethods())
  .use(www.routes());

export default app;
