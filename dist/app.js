'use strict';

var KoaRouter = require('koa-router');
var koaBodyParser = require('koa-bodyparser');
var apolloServerKoa = require('apollo-server-koa');
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

async function createContext(ctx) {
  return ctx;
}

async function createRootValue() {
  return {};
}

function formatError() {}

const graphql = new KoaRouter();
const graphqlEndpoint = '/graphql';
const bodyParser = koaBodyParser({
  extendTypes: {
    json: ['application/graphql'],
  },
});
const _graphql = apolloServerKoa.graphqlKoa(async function graph(ctx) {
  const { schema } = ctx;
  const context = await createContext(ctx);
  const rootValue = await createRootValue(ctx);
  return {
    schema,
    context,
    rootValue,
    formatError,
    formatResponse(response) {
      return response;
    },
  };
});
const _graphiql =
  apolloServerKoa.graphiqlKoa({
        endpointURL: graphqlEndpoint,
      });
graphql
  .post(graphqlEndpoint, bodyParser, _graphql)
  .get(graphqlEndpoint, bodyParser, _graphql);
if (_graphiql) { graphql.get('/graphiql', _graphiql); }

const router = new KoaRouter();
router
  .use(graphql.routes())
  .use(graphql.allowedMethods())
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

const schema = require('./schema');
const { mongo, redis } = require('./db');
const app = new Koa();
app.context.schema = schema;
app.context.mongo = mongo;
app.context.redis = redis;
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
