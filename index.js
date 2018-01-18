require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');

const {mongoose} = require('./db/mongoose');
const userController = require('./controllers/userController');
const ideaController = require('./controllers/ideaController');

const PORT = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());


app.get('/', (req, res) => {
    res.send("<html><head><title>Ideas App</title></head><body style='text-align: center'><h1>Ideas App</h1><footer>Created By Shoaib Khan</footer></body></html>");
});

userController(app);
ideaController(app);

app.listen(PORT, () => {
    console.log("Server Listening on port ", PORT);
});

module.exports = {app};