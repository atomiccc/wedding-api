const Koa = new require('koa');
const bodyParser = require('koa-bodyparser');
const app = new Koa();

// instantiate RethinkDB and start connetion pool
const rethinkdb = require('rethinkdbdash')();

// add r to ctx prototype so we don't need to import the database into every route.
// this is arguably not necessary since we are passing r into the route file also,
// but this will allow us to not be dependent on doing so in the future
app.context.rethinkdb = rethinkdb;

// parse body so ctx.request.body = { key: 'value' }
app.use(bodyParser());

// routes - passing in rethinkdb so we can keep initial database setup stuff for each
// route within the route file
const users = require('./routes/users')(rethinkdb);
const posts = require('./routes/posts')(rethinkdb);
const comments = require('./routes/comments')(rethinkdb);

app.use(users.routes());
app.use(posts.routes());
app.use(comments.routes());

app.listen(31337, function() {
  console.log('Server running on https://localhost:31337');
});
