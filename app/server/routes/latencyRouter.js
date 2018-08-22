var express = require('express');
var ping = require('ping');

var app = express();
var latencyRouter = express.Router();

latencyRouter.route('/').post((req, res) => {
    var host = req.body.host;
    // console.log('host: ' + host);
    // console.log('getting latency...');
    var start = new Date();
    ping.sys.probe(host, (isAlive) => {
        var end = new Date();
        return res.json({
            "host": host,
            "latency": (end - start),
        });
    });
});

module.exports = latencyRouter;