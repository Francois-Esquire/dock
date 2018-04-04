'use strict';

var KoaRouter = require('koa-router');
var koaSend = require('koa-send');
var μs = require('microseconds');
var Koa = require('koa');
var koaHelmet = require('koa-helmet');
var koaSession = require('koa-session');
var koaUserAgent = require('koa-useragent');
var koaCompress = require('koa-compress');
var koaCors = require('@koa/cors');

const api = new KoaRouter({ prefix: '/api' });

async function API(ctx) {
  ctx.status = 200;
  ctx.body = 'welcome to the api';
}

api.get(/\/*/, API);

// will be replaced during build by 'const render = require('./www');'
// otherwise working for tests.
const render = require('./www');

async function html(ctx) {
  // eslint-disable-next-line no-underscore-dangle
  const _html = await render(ctx);

  ctx.body = _html;
  ctx.status = 200;
  ctx.set('Content-Type', 'text/html');
}

const router = new KoaRouter();

router
  .use(api.allowedMethods())
  .use(api.routes())
  .get(/\/*/, html);

async function catcher(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.throw(
      500,
      `There was an error. Please try again later.\n\n${e.message}`,
      ctx
    );
  }
}

async function responseTime(ctx, next) {
  const start = μs.now();
  await next();
  const end = μs.parse(μs.since(start));
  const total = end.microseconds + end.milliseconds * 1e3 + end.seconds * 1e6;
  ctx.set('Response-Time', `${total / 1e3}ms`);
}

async function statics(ctx, next) {
  if (/\.(ico|png|jpg|jpeg|svg|css|js|json)$/.test(ctx.path)) {
    try {
      const root = `${__dirname}/public`;

      const { path } = ctx;

      await koaSend(ctx, path, { root });
    } catch (e) {
      /**/
    }
  } else { await next(); }
}

const app = new Koa();

app
  .use(catcher)
  .use(responseTime)
  .use(
    koaCors({
      allowMethods: ['HEAD', 'GET', 'POST'],
      credentials: true,
      keepHeadersOnError: true,
    })
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
      app
    )
  )
  .use(koaCompress());

{
  if (global.webpack) { app.use(global.webpack); }
}

app
  .use(statics)
  .use(router.allowedMethods())
  .use(router.routes());

module.exports = app;
