const Router = require('koa-router');
const router  = new Router();

// export function so we can pass r in and initialize database if need be
// this might change in the future and is really just for convenience
module.exports = (r) => {
  // r.db('test').tableDrop('posts').run();
  r.db('test').tableList().run().then((tables) => {
    if (!tables.includes('posts')) {
      r.tableCreate('posts').run();
    }
  });

  return router;
}

router.post('/posts', createPost);
router.get('/posts', getPosts);

async function createPost(ctx, next) {
  let {
    owner,
    title,
    body
  } = ctx.request.body;


  try {
    if (!title || !body || !owner) {
        ctx.status = 412;
        ctx.body = 'required parameters: title, body, owner';
    }
    else {
      let post = await ctx.r.table('posts').insert({
        owner,
        title,
        body,
        postDate: Date.now(),
        editDate: null,
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
    let posts = await ctx.r.table('posts')
    ctx.body = posts;
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error adding user!';
  }
}
