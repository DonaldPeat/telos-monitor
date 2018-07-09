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
    var pModel = new ProducerModel(req.body.producer);
    pModel.save()
        .then(acc => {
            res.json('Producer added successfully.');
            var producer = req.body;
            axios.post('http://localhost:5300/', producer)
                .then(res => console.log("response: " + res))
                .catch(err => console.log("error message: " + err));
        })
        .catch((err) => res.status(400).send("unable to save to database"));
});

module.exports = producerRouter;