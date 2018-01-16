const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ideaSchema = new Schema({
    idea: {
        type: String,
        required: true,
        minlength: 1
    },
    rating: {
        type: Number,
        required: false,
        max: 10,
        min: 1
    },
    createdOn: {
        type: Date,
        default: null
    },
    _creator: {
        required: true,
        type: Schema.Types.ObjectId
    }
});

var Idea = mongoose.model('Idea', ideaSchema);

module.exports = {Idea};