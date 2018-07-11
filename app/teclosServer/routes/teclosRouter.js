
var shell = require('shelljs');
var express = require('express');

var app = express();
var teclosRouter = express.Router();

teclosRouter.route('/').post((req, res) => {
    const SYMBOL = "TLOS";
    const MEMO = "Regiter producer account.";
    const CPU = "1000";
    const NET = "1000";
    const RAM = "1000";
    const AMOUNT = "1000";

    console.log("req body: ", req.body.producer);

    var accountName = req.body.producer.name;
    var ownerPubKey = req.body.producer.ownerPublicKey;
    var activePubKey = req.body.producer.activePublicKey;

    // Running teclos commands
    const teclosUnlockWallet = '/home/dev/telos-foundation-projects/telos-monitor/app/teclosserver/tlos-tool/tlos-tool.py --unlock';
    const createAccountCMD = `teclos system newaccount --transfer eosio ${accountName} ${ownerPubKey} ${activePubKey} --stake-net "${NET}.0000 ${SYMBOL}" --stake-cpu "${CPU}.0000 ${SYMBOL}" --buy-ram "${RAM}.0000 ${SYMBOL}"`;
    const transferCMD = `teclos transfer eosio ${accountName} "${AMOUNT}.0000 ${SYMBOL}" "${MEMO}"`;
    console.log("executing cleos...");
    shell.echo("ECHO...");
    shell.echo(teclosUnlockWallet);
    shell.echo(createAccountCMD);
    shell.echo(transferCMD);
    shell.echo("END ECHO...");
    shell.echo("EXEC...");
    shell.exec(teclosUnlockWallet);
    var createAccountResult = shell.exec(createAccountCMD);
    var transferResult = shell.exec(transferCMD);
    shell.echo("END EXEC...");

    res.json({
        "createAccountResult": createAccountResult,
        "transferResult": transferResult
    })

});

module.exports = teclosRouter;
