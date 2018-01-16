const _ = require('lodash');

const {User}  = require('./../models/userModel');
const {authenticate} = require('./../middleware/authentication');


module.exports = function (app) {
    //Create new user by email and password
    app.post('/user', (req, res) => {
        var body = _.pick(req.body, ['email', 'password']);
        var newUser = new User(body);

        newUser.save().then(() => {
            return newUser.generateAuthToken();
        })
            .then(token => res.header('x-auth', token).send(newUser))
            .catch((err) => res.status(400).send(err));

    });


    /*
    *   Login a User
    *   If Email and Password combo is correct send 200 with x-auth header containing jwt token
    *   If Email not found in DB return {message: "Email Not Found"} with 401 status
    *   If Password incorrect return {message: "Incorrect Password"} with 401 status
    */
    app.post('/user/login', (req, res) => {
        var body = _.pick(req.body, ['email', 'password']);

        User.findByCredentials(body.email, body.password)
            .then(user => {
                return user.generateAuthToken()
                    .then(token => {
                        res.header('x-auth', token).send(user);
                    });
            })
            .catch((err) => res.status(401).send(err));
    });


    /*
    * Delete token from DB if token is valid
    * */
    app.delete('/user/logout',authenticate, (req, res) => {

        //Got req.user from authenticate middleware which checks for token validity
        req.user.removeToken(req.token).then(() => {
            res.status(200).send({message: 'Token removed successfully' });
        }, () => res.status(400).send())
    });

};