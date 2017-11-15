const Koa = new require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const bcrypt = require('bcrypt');
const saltRounds = 9;

const r = require('rethinkdbdash')();


r.db('test').tableList().run().then((tables) => {
  console.log(tables);
  if (!tables.includes('users')) {
    r.tableCreate('users').run();
  }
});

const koa = new Koa();
const router  = new Router();

koa.use(bodyParser());

router.get('/hello', getMessage);
router.post('/users', addUser);
router.get('/users', listUsers);

function getMessage(ctx, next) {
  ctx.body = 'Hello World Message!';
}

async function addUser(ctx, next) {
  let { email, password } = ctx.request.body;

  try {
    let hash = await bcrypt.hash(password, saltRounds);
    let user = await r.table('users').insert({ email, password: hash });
    ctx.body = user;
  }
  catch(e) {
    ctx.status = 500;
    ctx.body = e.message || 'error adding user!';
  }
}

async function listUsers(ctx, next) {
  try {
    let users = await r.table('users');
    ctx.body = users;
  }
  catch(e) {
    ctx.status = 500;
    ctx.body = e.message || 'error listing users!';
  }
}

koa.use(router.routes());

koa.listen(3000, function() {
  console.log('Server running on https://localhost:3000');
});
