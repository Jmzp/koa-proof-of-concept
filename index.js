const Koa = require('koa');
const Router = require('koa-router');
const BodyParser = require('koa-body');

const app = new Koa();
const router = new Router();

const tasks = require('./routes/tasks');


// logger
app.use(async (ctx, next) => {
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

// x-response-time

app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const ms = Date.now() - start;
    ctx.set('X-Response-Time', `${ms}ms`);
});


router.get('/', (ctx, next) => {
   ctx.body = "Hi, I'm a endpoint"
});

app.use(router.allowedMethods());
app.use(BodyParser());
app.use(router.routes());
app.use(tasks.routes());

app.listen(3000, () => {
    console.log("Server running at port 3000");
});