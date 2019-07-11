const Router = require('koa-router');
const Task = require('../models/Tasks');

const router = new Router();

router.get('/api/v1/tasks', async (ctx) => {
    await Task.findAll()
        .then(tasks => {
            ctx.body = tasks;
        })
        .catch(err => {
            Object.assign(ctx, { status: 500, body: { errors: [{ msg: err }] } });
        })
});
router.post('/api/v1/task', async (ctx) => {
    if (!ctx.request.body.task_name){
        Object.assign(ctx, { status: 401, body: { errors: [{ msg: 'Bad Data' }] } });
    } else {
        await Task.create(ctx.request.body)
            .then(data => {
                ctx.body = data;
            })
            .catch(err => {
                Object.assign(ctx, { status: 500, body: { errors: [{ msg: err }] } });
            })
    }

});

module.exports = router;
