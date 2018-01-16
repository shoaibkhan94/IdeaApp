const mongoose = require('mongoose');
const validator = require('validator');


var Schema = mongoose.Schema;

var userSchema = new Schema({
    email: {
        required: true,
        type: String,
        minlength: 1,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => validator.isEmail(value),
            message: 'Not a valid Email'
        }
    },
    password: {
        required: true,
        type: String,
        minlength: 8
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

var User = mongoose.model('User', userSchema);

module.exports = {User};