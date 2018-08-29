var axios = require('axios');
var express = require('express');

var app = express();
var producerRouter = express.Router();

var ProducerModel = require('../db/models/producerModel');
var AccountFaucetModel = require('../db/models/accountFaucetModel');

producerRouter.route('/').get((req, res) => {
    ProducerModel.find((err, itms) => {
        if (err) console.log(err);
        else  res.status(200).json(itms);
    });
});

producerRouter.route('/').post((req, res) => {
    var pModel = new ProducerModel(req.body.producer);
    pModel.save()
        .then(acc => {
            var producer = req.body;
            axios.post('http://localhost:5500/api/v1/teclos', producer)
                .then(resp => {
                    let data = resp.data;
                    let msg = { 
                        result: "Account added successfully", 
                        createAccount: data.createAccountResult, 
                        transferTLOS: data.transferResult 
                    };
                    res.status(200).json(msg);
                })
                .catch(err => console.log("error message: " + err));
        })
        .catch((err) => res.status(400).send("unable to save to database"));
});


producerRouter.route('/createaccount').post((req, res) => {
  var account = req.body;
  axios.post('http://localhost:5500/api/v1/teclos/createaccount', account)
      .then(acc => {
        res.status(200).json(acc.data);
      })
      .catch(err => console.log('error message: ' + err));
});

/*
 * GET TLOS FROM FAUCET
 */
const MAX_TX_PER_ACCOUNT = 400;
var _numberMaxOfTxPerHr = 400;
var _currentTxHour = Date.now();

producerRouter.route('/gettlos').post((req, res) => {
  var account = req.body;
  AccountFaucetModel.find({name: account.name})
      .then(rslt => verifyAndExecuteTx(rslt, account, res))
      .catch(error => console.log(error));
});

function verifyAndExecuteTx(AccTxs, account, res){
    var now = Date.now();
    var initTxHour = new Date(_currentTxHour);
    var nextHour = initTxHour.setHours(initTxHour.getHours() + 1);

    //The faucet can only be called 400 times in one hour.
    //400 times = 40,000TLOS/hr
    if (now > _currentTxHour && now < nextHour) {
        if (_numberMaxOfTxPerHr > 0) executeTx(AccTxs, account, res);
        else res.status(403).json({"msg": "Number of faucet withdrawals per hour has exceeded. Try next time at: " + new Date(nextHour)});
    } else {
        //reset total tx
        //reset current tx time
        _numberMaxOfTxPerHr = 399;
        _currentTxHour = Date.now();
        executeTx(AccTxs, account, res);
    }
}

function executeTx(AccTxs, account, res){
    // 400 = 40,000 TLOS
    if (AccTxs.length == MAX_TX_PER_ACCOUNT) res.status(403).json({"msg": "Account has exceeded withdrawals lifetime."});
    else {
        if (AccTxs.length < 2) {
            accountRequestedMoney(account.name, res);
            _numberMaxOfTxPerHr--;
        } else {
            var now = new Date(Date.now());
           
            var lastTx1 = AccTxs[AccTxs.length - 1];
            var lastTx2 = AccTxs[AccTxs.length - 2];
            var lastTxTime1 = new Date(lastTx1.timeRequested)
            var lastTxTime2 = new Date(lastTx2.timeRequested)
            
            var hrDiff1 = (now.valueOf() - lastTxTime1.valueOf()) /3600000;// Convert milliseconds to hours
            var hrDiff2 = (now.valueOf() - lastTxTime2.valueOf()) /3600000;// Convert milliseconds to hours

            if(hrDiff1 < 1 && hrDiff2 < 1) res.status(403).json({"msg": "Account has exceeded withdrawals per hour"});
            else  {
                accountRequestedMoney(account.name, res);
                _numberMaxOfTxPerHr--;
            }
        }
    }
}

function accountRequestedMoney(accName, res) {
  var afModel = new AccountFaucetModel({name: accName, timeRequested: Date.now()});
  
  axios.post('http://localhost:5500/api/v1/teclos/gettlos', {name: accName})
      .then(acc => 
        afModel.save()
        .then(result => res.status(200).json(result))
        .catch(err => console.log('error db: ' + err)))
      .catch(err => console.log('request error: ' + err));
}

module.exports = producerRouter;