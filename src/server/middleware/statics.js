import koaSend from 'koa-send';

export default async function statics(ctx, next) {
  if (/\.(ico|png|jpg|jpeg|svg|css|js|json)$/.test(ctx.path)) {
    try {
      const { path, root } = ctx;

      await koaSend(ctx, path, { root });
    } catch (e) {
      /**/
    }
  } else await next();
}
