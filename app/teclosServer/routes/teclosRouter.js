
var shell = require('shelljs');
var express = require('express');

var app = express();
var teclosRouter = express.Router();

teclosRouter.route('/:prodKey').get((req, res) => {
    var prodKey = req.params.prodKey;
    if (prodKey) {
        try {
            const tlosProdKeyRegex = /TLOS[a-zA-Z0-9_]{50}/;
            var regex = new RegExp(tlosProdKeyRegex);
            var regexResult = regex.test(prodKey);
            if(!regexResult) throw new Error("invalid producer key");

            const verifyAccountsCMD = `teclos get accounts ${prodKey}`
            shell.echo("---START ECHO---");
            shell.echo(verifyAccountsCMD);
            shell.echo("---END ECHO---");

            shell.echo("---EXEC---");
            var resultAccountsCMDJSON = shell.exec(verifyAccountsCMD);
            shell.echo("result:");
            shell.echo(resultAccountsCMDJSON);
            var result = JSON.parse(resultAccountsCMDJSON)
            shell.echo("---END EXEC---");

            res.json({
                "error": "",
                "accounts": result.account_names,
                "numberAccounts": result.account_names.length
            });
        } catch (error) {
            shell.echo("---------ERROR---------");
            shell.echo(error);
            res.json({
                "error": "invalid prodKey",
                "accounts": [],
                "numberAccounts": -1
            });
        }
    } else {
        res.json({
            "error": "prodKey is undefined",
            "accounts": [],
            "numberAccounts": -1
        });
    }
});


teclosRouter.route('/').post((req, res) => {
    const SYMBOL = "TLOS";
    const MEMO = "Regiter producer account.";
    const CPU = "1000";
    const NET = "1000";
    const RAM = "1000";
    const AMOUNT = "1000";

    var producer = req.body.producer;
    console.log("req body: ", producer);

    if (producer) {
        var accountName = producer.name;
        var ownerPubKey = producer.ownerPublicKey;
        var activePubKey = producer.activePublicKey;

        // Running teclos commands
        const teclosUnlockWallet = 'tlos --unlock';
        const createAccountCMD = `teclos system newaccount --transfer eosio ${accountName} ${ownerPubKey} ${activePubKey} --stake-net "${NET}.0000 ${SYMBOL}" --stake-cpu "${CPU}.0000 ${SYMBOL}" --buy-ram "${RAM}.0000 ${SYMBOL}"`;
        const transferCMD = `teclos transfer eosio ${accountName} "${AMOUNT}.0000 ${SYMBOL}" "${MEMO}"`;
        console.log("executing cleos...");
        shell.echo("---START ECHO---");
        shell.echo(teclosUnlockWallet);
        shell.echo(createAccountCMD);
        shell.echo(transferCMD);
        shell.echo("---END ECHO---");
        shell.echo("---EXEC---");
        shell.exec(teclosUnlockWallet);
        var createAccountResult = shell.exec(createAccountCMD);
        var transferResult = shell.exec(transferCMD);
        shell.echo("---END EXEC---");

        res.json({
            "error": "",
            "createAccountResult": createAccountResult,
            "transferResult": transferResult
        });

    } else {
        res.json({
            "error": "producer is undefined",
            "createAccountResult": "",
            "transferResult": ""
        });
    }

});

module.exports = teclosRouter;
