const Koa = new require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');

const bcrypt = require('bcrypt');
const saltRounds = 9;

const r = require('rethinkdbdash')();

// r.db('test').tableDrop('users').run();

r.db('test').tableList().run().then((tables) => {
  console.log(tables);
  if (!tables.includes('users')) {
    r.tableCreate('users', { primaryKey: 'email' }).run();
  }
});

const koa = new Koa();
const router  = new Router();

koa.use(bodyParser());

router.post('/users', addUser);
router.post('/users/auth', authUser);
router.get('/users', listUsers);

async function addUser(ctx, next) {
  let { email, password } = ctx.request.body;
  try {
    let hash = await bcrypt.hash(password, saltRounds);
    let user = await r.table('users').insert({ email, password: hash });
    ctx.body = user;
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error adding user!';
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

async function authUser(ctx, next) {
  let { email, password } = ctx.request.body;
  try {
    let user = await r.table('users').get(email);
    let authorized = await bcrypt.compare(password, user.password);
    ctx.body = authorized ? 'authorized!' : 'bad password!';
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error authorizing!';
  }
}

koa.use(router.routes());

koa.listen(31337, function() {
  console.log('Server running on https://localhost:31337');
});
