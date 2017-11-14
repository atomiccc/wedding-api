const Koa = new require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const koa = new Koa();
const router  = new Router();

koa.use(bodyParser());

router.get('/hello', getMessage);
router.post('/users', addUser);
router.get('/users', listUsers);

function getMessage(ctx, next) {
  ctx.body = 'Hello World Message!';
}

function addUser(ctx, next) {
  console.log(ctx.request.body);
  let {
    email,
    password
  } = ctx.request.body;

  ctx.body = `recieved ${email} and ${password}!`;
}

function listUsers(ctx, next) {
  console.log(ctx.request);
  ctx.body = 'all users';
}

koa.use(router.routes());

koa.listen(3000, function() {
  console.log('Server running on https://localhost:3000');
});
