'use strict';

var Koa = require('koa');
var KoaRouter = require('koa-router');
var koaHelmet = require('koa-helmet');
var koaSession = require('koa-session');
var koaUserAgent = require('koa-useragent');
var koaCompress = require('koa-compress');
var koaCors = require('@koa/cors');
var koaSend = require('koa-send');
var μs = require('microseconds');

// require statement is ignored during build.
// Used to reference files in dist/
var render = require('./www');

async function www(ctx) {
    var html = await render(ctx);

    ctx.body = html;
    ctx.status = 200;
    ctx.set('Content-Type', 'text/html');
}

async function last(ctx, next) {
    try { await next(); } catch (e) {
        ctx.throw(500, ("There was an error. Please try again later.\n\n" + (e.message)), ctx);
    }
}

async function responseTime(ctx, next) {
    var start = μs.now();
    await next();
    var end = μs.parse(μs.since(start));
    var total = end.microseconds + (end.milliseconds * 1e3) + (end.seconds * 1e6);
    ctx.set('Response-Time', ((total / 1e3) + "ms"));
}

async function statics(ctx, next) {
    if (/\.(ico|png|svg|css|js|json)$/.test(ctx.path)) {
      try {
        await koaSend(ctx, ctx.path, { root: ((process.cwd()) + "/public") });
      } catch (e) { /**/ }
    } else { await next(); }
}

var app = new Koa();

var api = new KoaRouter({ prefix: '/api' });

api
    .get(/\/*/, async function API(ctx) {
        ctx.status = 200;
        ctx.body = 'welcome to our api';
    });

var router = new KoaRouter();

router
    .get(/\/*/, www);

app
    .use(last)
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

module.exports = app;
