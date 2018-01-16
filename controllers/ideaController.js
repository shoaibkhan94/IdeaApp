const _ = require('lodash');

const {Idea}  = require('./../models/ideaModel');
const {authenticate} = require('./../middleware/authentication');

module.exports = function (app) {


    /*
    * Post a new idea
    * */
    app.post('/ideas', authenticate, (req, res) => {

    });


    /*
    * Get all ideas of a user
    * */
    app.get('/ideas', authenticate, (req, res) => {

    });

    /*
    * Get an idea by id
    * */
    app.get('/idea/:id', authenticate, (req, res) => {

    });


    /*
    * Add/Modify an idea
    * */
    app.patch('/idea/:id', authenticate, (req, res) => {

    });


    /*
    * Delete an Idea
    * */
    app.delete('/idea/:id', authenticate, (req, res) => {

    });



};