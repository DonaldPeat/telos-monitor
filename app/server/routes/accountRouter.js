
var express = require('express');

var app = express();
var accountRouter = express.Router();

var AccountModel = require('../db/models/accountModel');

//Get all data(index or listing) route
accountRouter.route('/').get((req, res) => {
    AccountModel.find((err, itms) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(itms);
        }
    });
});

accountRouter.route('/addaccount').post((req, res) => {
    var account = req.body;
    var aModel = new AccountModel(account);
    aModel.save()
        .then(acc => res.json('Account added successfully.'))
        .catch((err) => res.status(400).send("unable to save to database"));
});

accountRouter.route('/updateaccount/:name').post((req, res) => {
    console.log(req.params.name);
    var accountName = req.body.name;
    AccountModel.findOne({ name: req.params.name }, (err, itm) => {
        if (err) return next(new Error('Could not load Document'));
        else {
            if (itm) {
                console.log("item", itm);
                itm.name = req.body.name;
                itm.ownerPubKey = req.body.ownerPubKey;
                itm.activePubKey = req.body.activePubKey;
                itm.save()
                    .then(acc => res.json('Account updated successfully.'))
                    .catch((err) => res.status(400).send('unable to update the database'));
            } else res.json('No account with this name founded');
        }
    });
});

accountRouter.route('/deleteaccount/:name').delete((req, res) => {
    AccountModel.findOneAndRemove({ name: req.params.name }, (err, r) => {
        if (err) res.json(err);
        else res.json('Successfully removed');
    });
});

module.exports = accountRouter;