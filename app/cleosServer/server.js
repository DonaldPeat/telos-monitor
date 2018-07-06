var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
const _port = 5300;

// Use middlewares to set view engine and post json data to the server
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var cleosRouter = require('./routes/cleosRouter');
app.use('/', cleosRouter);

app.listen(_port, () => {
    console.log('server cleos listening...');
});