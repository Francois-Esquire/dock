'use strict';

var KoaRouter = require('koa-router');
var μs = require('microseconds');
var koaSend = require('koa-send');
var Koa = require('koa');
var koaHelmet = require('koa-helmet');
var koaSession = require('koa-session');
var koaUserAgent = require('koa-useragent');
var koaCompress = require('koa-compress');
var koaCors = require('@koa/cors');

const markup = require('./www');
const www = new KoaRouter();
www.get('/*', async function html(ctx) {
  ctx.set('Content-Type', 'text/html');
  try {
    ctx.body = await markup.render(ctx);
  } catch (e) {
    if (e.code === undefined) { e.code = 500; }
    ctx.body = markup.error(ctx, e);
  }
});

const api = new KoaRouter({ prefix: '/api' });
api.get(/\/*/, async function rest(ctx) {
  ctx.status = 200;
  ctx.body = 'welcome to the api endpoint';
});

const router = new KoaRouter();
router
  .use(api.routes())
  .use(api.allowedMethods())
  .use(www.routes())
  .use(www.allowedMethods());

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
  if (/\.(ico|png|jpg|jpeg|svg|css|js|json|html)$/.test(ctx.path)) {
    try {
      const { path, root } = ctx;
      await koaSend(ctx, path, { root });
    } catch (e) {
    }
  } else { await next(); }
}

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
  .use(koaCompress())
  .use(statics)
  .use(router.allowedMethods())
  .use(router.routes());

module.exports = app;
