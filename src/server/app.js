import Koa from 'koa';
import koaHelmet from 'koa-helmet';
import koaSession from 'koa-session';
import koaUserAgent from 'koa-useragent';
import koaCompress from 'koa-compress';
import koaCors from '@koa/cors';

import router from './routes';

import { catcher, responseTime, statics } from './middleware';

const app = new Koa();

app.context.root = `${__dirname}/public`;

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
      },
      app,
    ),
  )
  .use(koaCompress())
  .use(statics)
  .use(router.allowedMethods())
  .use(router.routes());

export default app;
