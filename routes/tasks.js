const Router = require('koa-router');
const Task = require('../models/Tasks');

const router = new Router();

router.get('/tasks', async (ctx) => {
    await Task.findAll()
        .then(tasks => {
            ctx.body = tasks;
        })
        .catch(err => {
            Object.assign(ctx, { status: 500, body: { errors: [{ msg: err }] } });
        })
});

router.get('/task/:id', async (ctx) => {
    await Task.findOne({
        where: {
            id: ctx.params.id
        }
    })
        .then(tasks => {
            if (tasks === null){
                Object.assign(ctx, { status: 404, body: { errors: [{ msg: 'Task does not exist' }] } });
            }
            else {
                ctx.body = tasks;
            }
        })
        .catch(() => {
            Object.assign(ctx, { status: 500, body: { errors: [{ msg: err }] } });
        })
});

router.post('/task', async (ctx) => {
    if (!ctx.request.body.task_name){
        Object.assign(ctx, { status: 401, body: { errors: [{ msg: 'Invalid Data' }] } });
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

router.delete('/task/:id', async (ctx) => {
    await Task.destroy({
        where: {
            id: ctx.params.id
        }
    })
        .then(res => {
            if(res === 0){
                Object.assign(ctx, { status: 404, body: { errors: [{ msg: 'Task does not exist' }] } });
            }
            else{
                ctx.body = {message: 'Task deleted successful'}
            }
        })
        .catch(err => {
            Object.assign(ctx, { status: 500, body: { errors: [{ msg: err }] } });
        })
});

router.put('/task/:id', async (ctx) => {
    if (!ctx.request.body.task_name){
        Object.assign(ctx, { status: 401, body: { errors: [{ msg: 'Invalid Data' }] } });
    } else {
        await Task.update(
            {task_name: ctx.request.body.task_name},
            {where: {id: ctx.params.id}}
        )
            .then(res => {
                if(res[0] === 0){
                    Object.assign(ctx, { status: 404, body: { errors: [{ msg: 'Task does not exist' }] } });
    }
                else{
                    ctx.body = {message: 'Task updated successful'}
                }
            })
            .catch(err => {
                Object.assign(ctx, { status: 500, body: { errors: [{ msg: err }] } });
            })
    }
});

module.exports = router;
