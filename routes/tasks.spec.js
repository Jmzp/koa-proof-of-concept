const request = require('supertest');
const Koa = require('koa');
const BodyParser = require('koa-bodyparser');
const tasksAPI =  require('./tasks');
const tasks = require('../models/Tasks');

describe('tasks', () => {
    let app;
    let server;

    beforeEach(() => {
        app = new Koa();
        app.use(BodyParser());
        app.use(tasksAPI.routes());
        server = app.listen();
    });

    afterEach(() => {
        server.close();
    });

    describe('/tasks', () => {
        test('get all tasks', async () => {
            const data = { id: 1, task_name: 'test task' };
            const findAll = jest.fn(() => Promise.resolve(data));
            jest.spyOn(tasks, 'findAll').mockImplementation(findAll);

            const response = await request(server)
                .get('/tasks');

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(findAll).toBeCalledWith();
        });
    });

    describe('/task/:id', () => {
        test('get task by id', async () => {
            const data = { id: 1, task_name: 'test task' };
            const findOne = jest.fn(() => Promise.resolve(data));
            jest.spyOn(tasks, 'findOne').mockImplementation(findOne);

            const response = await request(server)
                .get(`/task/1`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(findOne).toBeCalledWith({where: {
                    id: '1'
                }});
        });

        test('get task by id and the task not found', async () => {
            const findOne = jest.fn(() => Promise.resolve(null));
            jest.spyOn(tasks, 'findOne').mockImplementation(findOne);

            const response = await request(server)
                .get(`/task/1`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ errors: [{ msg: 'Task does not exist' }] });
            expect(findOne).toBeCalledWith({where: {
                    id: '1'
                }});
        });

        test('delete task by id', async () => {
            const data = { message: 'Task deleted successful' };
            const destroy = jest.fn(() => Promise.resolve(data));
            jest.spyOn(tasks, 'destroy').mockImplementation(destroy);

            const response = await request(server)
                .delete(`/task/1`);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(destroy).toBeCalledWith({where: {
                    id: '1'
                }});
        });

        test('delete task by id and the task not found', async () => {
            const destroy = jest.fn(() => Promise.resolve(0));
            jest.spyOn(tasks, 'destroy').mockImplementation(destroy);

            const response = await request(server)
                .delete(`/task/1`);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ errors: [{ msg: 'Task does not exist' }] });
            expect(destroy).toBeCalledWith({where: {
                    id: '1'
                }});
        });

        test('update task by id', async () => {
            const data = { message: 'Task updated successful' };
            const dataToSend = { task_name: 'test task' };
            const update = jest.fn(() => Promise.resolve(data));
            jest.spyOn(tasks, 'update').mockImplementation(update);

            const response = await request(server)
                .put(`/task/1`)
                .send(dataToSend);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(update).toBeCalledWith(dataToSend, {where: {id: '1'}})
        });

        test('update task by id and the task not found', async () => {
            const dataToSend = { task_name: 'test task' };
            const update = jest.fn(() => Promise.resolve([0]));
            jest.spyOn(tasks, 'update').mockImplementation(update);

            const response = await request(server)
                .put(`/task/1`)
                .send(dataToSend);

            expect(response.status).toBe(404);
            expect(response.body).toEqual({ errors: [{ msg: 'Task does not exist' }] });
            expect(update).toBeCalledWith(dataToSend, {where: {id: '1'}})
        });

    });

    describe('/task', () => {
        test('create a task', async () => {
            const data = { id: 1, task_name: 'test task' };
            const datToSend = { task_name: 'test task' };
            const create = jest.fn(() => Promise.resolve(data));
            jest.spyOn(tasks, 'create').mockImplementation(create);

            const response = await request(server)
                .post('/task')
                .send(datToSend);

            expect(response.status).toBe(200);
            expect(response.body).toEqual(data);
            expect(create).toBeCalledWith(datToSend);
        });

        test('create invalid task', async () => {
            const datToSend = { task_n: 'test task' };

            const response = await request(server)
                .post('/task')
                .send(datToSend);

            expect(response.status).toBe(401);
            expect(response.body).toEqual({ errors: [{ msg: 'Invalid Data' }] });
        });
    });

});