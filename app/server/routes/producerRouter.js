var axios = require('axios');
var express = require('express');

var app = express();
var producerRouter = express.Router();

var ProducerModel = require('../db/models/producerModel');

producerRouter.route('/').get((req, res) => {
    ProducerModel.find((err, itms) => {
        if (err) console.log(err);
        else res.json(itms);
    });
});

producerRouter.route('/').post((req, res) => {
    var pModel = new ProducerModel(req.body.producer);
    pModel.save()
        .then(acc => {
            var producer = req.body;
            axios.post('http://66.42.66.39:5500/api/v1/teclos', producer)
                .then(resp => {
                    let data = resp.data;
                    let msg = { 
                        result: "Account added successfully", 
                        createAccount: data.createAccountResult, 
                        transferTLOS: data.transferResult 
                    };
                    res.json(msg);
                    console.log("response: ", msg)
                })
                .catch(err => console.log("error message: " + err));
        })
        .catch((err) => res.status(400).send("unable to save to database"));
});

module.exports = producerRouter;