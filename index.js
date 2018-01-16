require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const PORT = process.env.PORT || 3000;

var app = express();

app.get('/', (req, res) => {
    res.send("IDEA APP");
});

app.listen(PORT, () => {
    console.log("Server Listening on port ",PORT);
});

module.exports = {app};