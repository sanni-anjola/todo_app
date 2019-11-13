const { expect } = require('chai');
const request = require('supertest');
const { ObjectID } = require('mongodb');

const { app } = require('./../server');
const { Todo } = require('./../models/todo');

let todos = [{
        _id: new ObjectID(),
        text: "First test todo"
    },
    {
        _id: new ObjectID(),
        text: "Second test todo",
        completed: true,
        completedAt: 333
    }
]

beforeEach((done) => {
    (async () => {

        try {
            await Todo.deleteMany({});
            await Todo.insertMany(todos);
            done();
        } catch (e) {
            done(e);
        }
    })();
    // Todo.deleteMany({}).then(() => done());
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({ text })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).to.be.equal(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                (async () => {
                    try {
                        let todos = await Todo.find({ text })
                        expect(todos.length).to.be.eql(1);
                        expect(todos[0].text).to.be.eql(text);
                        done()
                    } catch (e) {
                        done(e);
                    }

                })();
                // Todo.find().then((todos) => {
                //     expect(todos.length).to.be.equal(1);
                //     expect(todos[0].text).to.be.equal(text);
                //     done();

                // }).catch((e) => done(e));
            });
    });

    it('should not create todo for invalid data', (done) => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                (async () => {
                    try {
                        let todos = await Todo.find();
                        expect(todos.length).to.be.equal(2);
                        done();
                    } catch (e) {
                        done(e);
                    }
                })();
                // Todo.find().then((todos) => {
                //     expect(todos.length).to.be.equal(0);
                //     done();
                // }).catch((e) => done(e));

            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).to.be.equal(2);
            })
            .end(done)
    });
});

describe('GET /todos/:id', () => {
    it('should get a todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.be.equal(todos[0].text);
            })
            .end(done)
    });

    it('should return 404 for todo not found', (done) => {
        request(app)
            .get(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 for invalid object id', (done) => {
        request(app)
            .get('/todos/123')
            .expect(404)
            .end(done)
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        request(app)
            .delete(`/todos/${hexId}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).to.be.eql(hexId);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                (async () => {
                    try {
                        let todo = await Todo.findById(hexId);
                        expect(todo).to.be.null; // instead of to.not.exist
                        done();
                    } catch (e) {
                        done(e)
                    }
                })();
            });
    });
    it('should return 404 if todo not found', (done) => {
        request(app)
            .delete(`/todos/${new ObjectID().toHexString()}`)
            .expect(404)
            .end(done)
    });

    it('should return 404 for invalid ObjectID', (done) => {
        request(app)
            .delete('/todos/123abc')
            .expect(404)
            .end(done)
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let hexId = todos[0]._id.toHexString();
        let text = "Igba laye nlo";
        let completed = true;

        request(app)
            .patch(`/todos/${hexId}`)
            .send({ text, completed })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).to.be.equal(text);
                expect(res.body.todo.completed).to.be.true;
                expect(res.body.todo.completedAt).to.exist;
            })
            .end(done)
    });

    it('should clear completedAt when todo is not completed', (done) => {
        let hexId = todos[1]._id.toHexString();
        request(app)
            .patch(`/todos/${hexId}`)
            .send({ completed: false })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).to.be.false;
                expect(res.body.todo.completedAt).to.be.null;
            })
            .end(done)
    });
});