const mongoose = require('mongoose');

let User = mongoose.model('User', {
    email: {
        type: String,
        required: true,
        minlength: 1,
    }
})

// let newUser = new User({
//     email: 'www@yahoo.com'
// })

// const saveUser = async () => {
//     try {
//         let doc = await newUser.save()
//         console.log('User save successful', JSON.stringify(doc, null, 2));
//     } catch (e) {
//         console.log(e);
//     }
// }

// saveUser();

module.exports = { User };