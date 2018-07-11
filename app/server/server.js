var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');

var app = express();
const _port = 4200;

// Mongoose connection with mongodb
const _mongoURL = '';
mongoose.Promise = require('bluebird');
mongoose.connect(_mongoURL)
    .then(() => {
        console.log('Start listening to mongo...');
    })
    .catch(err => {
        console.error('App mongo starting error:', err.stack);
        process.exit(1);
    });

var accountRouter = require('./routes/accountRouter');
var emailRouter = require('./routes/emailRouter');
var latencyRouter = require('./routes/latencyRouter');
var producerRouter = require('./routes/producerRouter');

// Use middlewares to set view engine and post json data to the server
app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/', accountRouter);
app.use('/emailserver', emailRouter);
app.use('/api/v1/latency', latencyRouter);
app.use('/api/v1/producer', producerRouter);

app.listen(_port, () => {
    console.log('server listening...');
})