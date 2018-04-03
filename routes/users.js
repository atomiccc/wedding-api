const Router = require('koa-router');
const router  = new Router();
const bcrypt = require('bcrypt');
const saltRounds = 9;

// export function so we can pass r in and initialize database if need be
// this might change in the future and is really just for convenience
module.exports = (rethinkdb) => {
  //rethinkdb.db('test').tableDrop('users').run();
 rethinkdb.db('test').tableList().run().then((tables) => {
    console.log(tables);
    if (!tables.includes('users')) {
     rethinkdb.tableCreate('users', { primaryKey: 'email' }).run();
    }
  });

  return router;
}

// routes
//
// post
router.post('/users', createUser);
router.post('/users/auth', authUser);
// get
router.get('/users', getUsers);

// actions
//
async function createUser(ctx, next) {
  let { email, password } = ctx.request.body;
  try {
    let hash = await bcrypt.hash(password, saltRounds);
    let user = await ctx.rethinkdb.table('users').insert({ email, password: hash });
    ctx.body = user;
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error adding user!';
  }
}

async function authUser(ctx, next) {
  let { email, password } = ctx.request.body;
  try {
    let user = await ctx.rethinkdb.table('users').get(email);
    let authorized = await bcrypt.compare(password, user.password);
    if (authorized) {
      ctx.body = 'authorized!';
    }
    else {
      ctx.status = 401;
      ctx.body = 'bad password!';
    }
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error authorizing!';
  }
}

async function getUsers(ctx, next) {
  try {
    let users = await ctx.rethinkdb.table('users');
    ctx.body = users;
  }
  catch(e) {
    ctx.status = 500;
    ctx.body = e.message || 'error listing users!';
  }
}
