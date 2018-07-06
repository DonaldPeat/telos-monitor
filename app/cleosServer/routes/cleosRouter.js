
var shell = require('shelljs');
var express = require('express');

var app = express();
var cleosRouter = express.Router();

cleosRouter.route('/').post((req, res) => {
    const SYMBOL = "TLOS";
    const MEMO = "Regiter producer account.";
    const CPU = "1000";
    const NET = "1000";
    const RAM = "1000";
    const AMOUNT = "1000";
    var accountName = req.body.producer.name;
    var ownerPubKey = req.body.producer.ownerPublicKey;
    var activePubKey = req.body.producer.activePublicKey;
    // console.log(req.body.producer);
    const createAccountCMD = `cleos system newaccount --transfer eosio ${accountName} ${ownerPubKey} ${activePubKey} --stake-net "${NET}.0000 ${SYMBOL}" --stake-cpu "${CPU}.0000 ${SYMBOL}" --buy-ram "${RAM}.0000 ${SYMBOL}"`;
    const transferCMD = `cleos transfer eosio ${accountName} "${AMOUNT}.0000 ${SYMBOL}" "${MEMO}"`;
    console.log("executing cleos...");
    shell.echo("ECHO...");
    shell.echo(createAccountCMD);
    shell.echo(transferCMD);
    shell.echo("END ECHO...");
    shell.echo("EXEC...");
    shell.exec(createAccountCMD);
    shell.exec(transferCMD);
    shell.echo("END EXEC...");
});

module.exports = cleosRouter;
