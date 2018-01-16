const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

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

/*
* Hash the password with a salt before saving to DB
* */

userSchema.pre('save', function(next) {

    var user = this;

    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }
    else{
        next();
    }
});


/*
* Only return id and email when creating new user
* */
userSchema.methods.toJSON = function () {
    var user = this;
    userObj = user.toObject();
    return _.pick(userObj, ['_id','email']);
};


/*
* Generate authentication JWT Token using the user id and access param
* */
userSchema.methods.generateAuthToken = function () {

    //'this' has the individual document of the mongo collection
    var user = this;

    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString();

    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => token);
};


/*
* Remove token from individual document
* */
userSchema.methods.removeToken = function (token) {
    var user = this;

    return user.update({
        $pull: {
            tokens: {
                token: token
            }
        }
    });
};

/*
* Search User Collection for a matching email
* Check if (hashed) password stored, matches supplied password
* */
userSchema.statics.findByCredentials = function (email, password) {
    //this has the model of the mongo collection

    var User = this;

    return User.findOne({email}).then(user => {
        if(!user){
            return Promise.reject({message: "Email Not Found"});
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, function (err, res) {
                if(res){
                    return resolve(user);
                }
                else{
                    return reject({message: "Incorrect Password"});
                }
            });
        });
    });
};


/*
* Decode JWT token
* Extract user id (_id) from JWT and query User collection with _id, token and auth
* Return a Promise with found user or return a reject promise if user and token not match
* */
userSchema.statics.findByToken = function(token){
    //this has the model of the mongo collection

    var User  = this;
    var decoded;

    try{
        decoded = jwt.verify(token, process.env.JWT_SECRET);
    }catch (e){
        /*return new Promise((resolve, reject) => {
            reject();
        })*/
        return Promise.reject({message: "Invalid Token"});
    }

    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};




var User = mongoose.model('User', userSchema);

module.exports = {User};