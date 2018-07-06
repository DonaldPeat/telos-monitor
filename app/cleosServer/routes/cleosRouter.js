
var shell = require('shelljs');
var express = require('express');

var app = express();
var cleosRouter = express.Router();

cleosRouter.route('/').get((req, res) => {
    console.log("executing cleos...");
    shell.exec('ls');

});

module.exports = cleosRouter;
