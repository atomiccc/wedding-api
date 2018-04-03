const Router = require('koa-router');
const router  = new Router();

// export function so we can pass r in and initialize database if need be
// this might change in the future and is really just for convenience
module.exports = (rethinkdb) => {
  //rethinkdb.db('test').tableDrop('posts').run();
 rethinkdb.db('test').tableList().run().then((tables) => {
    if (!tables.includes('posts')) {
     rethinkdb.tableCreate('posts').run();
    }
  });

  return router;
}

router.post('/posts', createPost);
router.get('/posts', getPosts);

async function createPost(ctx, next) {
  let {
    createdBy,
    title,
    body
  } = ctx.request.body;


  try {
    if (!title || !body || !createdBy) {
        ctx.status = 412;
        ctx.body = 'required parameters: title, body, owner';
    }
    else {
      let post = await ctx.rethinkdb.table('posts').insert({
        title,
        body,
        createdBy,
        createdAt: Date.now(),
        editedAt: null,
        completed: false
      });
      ctx.body = post;
    }
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error adding user!';
  }
}

async function getPosts(ctx, next) {
  try {
    let posts = await ctx.rethinkdb.table('posts')
    ctx.body = posts;
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error adding user!';
  }
}
