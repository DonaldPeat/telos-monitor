var axios = require('axios');
var express = require('express');

var app = express();
var producerRouter = express.Router();

var ProducerModel = require('../db/models/producerModel');

producerRouter.route('/').get((req, res) => {
    ProducerModel.find((err, itms) => {
        if (err) {
            console.log(err);
        }
        else {
            res.json(itms);
        }
    });
});

producerRouter.route('/').post((req, res) => {
    var producer = req.body.producer;
    console.log(producer);

    var pModel = new ProducerModel(producer);
    pModel.save()
        .then(acc => {
            res.json('Producer added successfully.');
            axios.get('http://localhost:5300/')
                .then(res => console.log("response: " + res))
                .catch(err => console.log("error message: " + err));
        })
        .catch((err) => res.status(400).send("unable to save to database"));
});

module.exports = producerRouter;