
var express = require('express');

var app = express();
var accountRouter = express.Router();

var accountModel = require('../db/models/accountModel');

//Get data(index or listing) route
accountRouter.route('/').get((req, res) => {
    accountModel.find((err, itms) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(itms);
        }
    });
});



module.exports = accountRouter;