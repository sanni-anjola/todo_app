require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

const { mongoose } = require('./db/mongoose');
const { Todo } = require('./models/todo');
const { User } = require('./models/user');

const app = express();
app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    let todo = new Todo({
        text: req.body.text
    });

    let saveTodo = async () => {
        try {
            let doc = await todo.save();
            console.log('save successful');
            res.send(doc);
        } catch (err) {
            console.log('Unable to save todo');
            res.status(400).send(err);
        }
    }
    saveTodo();
});

app.get('/todos', (req, res) => {
    (async () => {
        try {
            let todos = await Todo.find();
            res.send({ todos });
        } catch (err) {
            res.status(400).send(err);
        }

    })();
});

app.get('/todos/:id', (req, res) => {
    let id = req.params.id;
    if (!ObjectID.isValid(id)) {
        return res.status(404).send()
    }

    (async () => {

        try {
            let todo = await Todo.findById(id);
            if (!todo) {
                return res.status(404).send();
            }
            res.send({ todo });
        } catch (e) {
            res.status(400).send();
        }
    })();

});

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    (async () => {
        try {
            let todo = await Todo.findByIdAndDelete(id, { useFindAndModify: false });
            if (!todo) {
                return res.status(404).send();
            }
            res.send({ todo });
        } catch (e) {
            res.status(400).send()
        }
    })();
});

app.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['text', 'completed']);

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    if (_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null;
    }

    (async () => {
        try {
            let todo = await Todo.findByIdAndUpdate(id, { $set: body }, { useFindAndModify: false, new: true });
            if (!todo) {
                return res.status(404).send()
            }
            res.send({ todo });
        } catch (e) {
            res.status(400).send();
        }
    })();

});

app.listen(3000, () => {
    console.log('Listening on port 3000')
});

module.exports = { app };