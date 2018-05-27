import KoaRouter from 'koa-router';

import www from './www';
import api from './api';

const router = new KoaRouter();

router
  .use(api.allowedMethods())
  .use(api.routes())
  .use(www.allowedMethods())
  .use(www.routes());

export default router;
