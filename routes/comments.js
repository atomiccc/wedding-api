const Router = require('koa-router');
const router  = new Router();

// export function so we can pass r in and initialize database if need be
// this might change in the future and is really just for convenience
module.exports = (r) => {
  // r.db('test').tableDrop('comments').run();
  r.db('test').tableList().run().then((tables) => {
    if (!tables.includes('comments')) {
      r.tableCreate('comments').run();
    }
  });

  return router;
}

router.post('/comments', createComment);
router.get('/comments', getComments);

async function createComment(ctx, next) {
  let {
    createdBy,
    postId,
    body
  } = ctx.request.body;


  try {
    if (!createdBy || !postId || !body) {
        ctx.status = 412;
        ctx.body = 'required parameters: { createdBy,  postId, body }';
    }
    else {
      let comment = await ctx.r.table('comments').insert({
        createdBy,
        postId,
        body,
        createdAt: Date.now(),
        editedAt: null,
        completed: false
      });
      ctx.body = comment;
    }
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error adding user!';
  }
}

async function getComments(ctx, next) {
  try {
    let comments = await ctx.r.table('comments')
    ctx.body = comments;
  }
  catch(e) {
    ctx.status = 500;
    console.error(e.message);
    ctx.body = 'error adding user!';
  }
}
