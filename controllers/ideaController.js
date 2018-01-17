const _ = require('lodash');
const moment = require('moment');
const {ObjectID} = require('mongodb');

const {Idea}  = require('./../models/ideaModel');
const {authenticate} = require('./../middleware/authentication');

module.exports = function (app) {


    /*
    * Post a new idea
    * */
    app.post('/ideas', authenticate, (req, res) => {
        var newIdea = new Idea({
            idea: req.body.idea,
            rating: parseInt(req.body.rating),
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
        }).catch(err => res.status(400).send(err));
    });

    /*
    * Get an idea by id
    * */
    app.get('/idea/:id', authenticate, (req, res) => {
        Idea.findOne({_id: req.params.id, _creator: req.user._id}).then(idea => {
            res.send({idea});
        }).catch(err => res.status(400).send(err))
    });


    /*
    * Add/Modify an idea
    * */
    app.patch('/idea/:id', authenticate, (req, res) => {

        const {id} = req.params;

        if(!ObjectID.isValid(id)){
            return res.status(404).send();
        }
        // Pick only Idea and Rating Modifications. Ignore others.
        var body = _.pick(req.body, ['idea', 'rating']);

        body.rating = parseInt(body.rating);
        Idea.findOneAndUpdate({_id: req.params.id, _creator: req.user._id}, {$set: body}, {new: true, runValidators: true})
            .then(idea => {
                res.send({idea});
            })
            .catch(err => res.status(400).send(err));
    });


    /*
    * Delete an Idea
    * */
    app.delete('/idea/:id', authenticate, (req, res) => {

        const {id} = req.params;

        if(!ObjectID.isValid(id)){
            return res.status(404).send();

        }

        Idea.findOneAndRemove({_id: req.params.id, _creator: req.user._id})
            .then(idea => res.send(idea))
            .catch(err => res.status(400).send(err));

    });



};