import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaHelmet from 'koa-helmet';
import koaSession from 'koa-session';
import koaUserAgent from 'koa-useragent';
import koaCompress from 'koa-compress';
import koaCors from '@koa/cors';

import html from './html';

import {
  catcher,
  responseTime,
  statics,
} from './middleware';

const app = new Koa();

const api = new KoaRouter({ prefix: '/api' });

async function API(ctx) {
  ctx.status = 200;
  ctx.body = 'welcome to our api';
}

api
  .get(/\/*/, API);

const router = new KoaRouter();

router
  .get(/\/*/, html);

app
  .use(catcher)
  .use(responseTime)
  .use(koaCors({
    allowMethods: ['HEAD', 'GET', 'POST'],
    credentials: true,
    keepHeadersOnError: true,
  }))
  .use(koaHelmet())
  .use(koaUserAgent)
  .use(koaSession({
    maxAge: (((60 * 60 * 24) * 31) * 1000),
    httpOnly: true,
    signed: true,
    key: '$$',
  //   domain: `.${domain}`,
  }, app))
  .use(koaCompress())
  .use(statics)
  .use(api.allowedMethods())
  .use(api.routes())
  .use(router.allowedMethods())
  .use(router.routes());

export default app;
