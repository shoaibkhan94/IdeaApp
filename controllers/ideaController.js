const _ = require('lodash');
const moment = require('moment');

const {Idea}  = require('./../models/ideaModel');
const {authenticate} = require('./../middleware/authentication');

module.exports = function (app) {


    /*
    * Post a new idea
    * */
    app.post('/ideas', authenticate, (req, res) => {
        var newIdea = new Idea({
            idea: req.body.idea,
            rating: req.body.rating,
            createdOn: moment().format('YYYY-MM-DD'),
            _creator: req.user._id
        });

        newIdea.save().then(idea => res.send(idea)).catch(err => res.status(400).send(err));

    });


    /*
    * Get all ideas of a user
    * */
    app.get('/ideas', authenticate, (req, res) => {
        Idea.find({_creator: req.user._id}).then(ideas => {
            res.send({ideas});
        }).catch(err => err);
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