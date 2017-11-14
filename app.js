const Koa = new require('koa');
const Router = require('koa-router');

const koa = new Koa();
const router  = new Router();

router.get('/hello', getMessage);

function getMessage(ctx, next) {
  ctx.body = 'Hello World Message!';
}

koa.use(router.routes());

koa.listen(3000, function() {
  console.log('Server running on https://localhost:3000');
});
