const mongoose = require('mongoose');

let Todo = mongoose.model('Todo', {
    text: {
        type: String,
        required: true,
        minlength: 1,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    },
    completedAt: {
        type: Number,
        default: null
    }
});

// let newTodo = new Todo({
//     text: 'Cook dinner'
// });

// let newTodo = new Todo({
//     text: '     exercise a little     ',
// });

// newTodo.save().then((doc) => {
//             console.log('save successful', doc);
//         },
//         (e) => {
//             console.log('Unable to save', e);
//         }
//     )
//     .catch((err) => {
//         console.log(err)
//     });

// const saveTodo = async () => {
//     try {
//         let doc = await newTodo.save()
//         console.log('save successful', JSON.stringify(doc, null, 2));
//     } catch (e) {
//         console.log(e);
//     }
// }

// saveTodo();

module.exports = { Todo };