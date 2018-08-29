
var shell = require('shelljs');
var express = require('express');

var app = express();
var teclosRouter = express.Router();

function validateTLOSKey(key) {
  const tlosKeyRegex = /TLOS[a-zA-Z0-9_]{50}/;
  var regex = new RegExp(tlosKeyRegex);
  var regexResult = regex.test(key);
  return regexResult;
}

async function accountExists(accountName) {
    const verifyAccountsCMD = `teclos get account ${accountName}`
    //if account doesn't exist it command throws an execption.
    await shell.exec(verifyAccountsCMD, async (code, stdout, stderr) => {
       return code != 1
    });
}

teclosRouter.route('/:prodKey').get((req, res) => {
    var prodKey = req.params.prodKey;
    if (prodKey) {
        try {
            if(!validateTLOSKey(prodKey)) throw new Error("invalid producer key");

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
            res.status(200).json({
                "error": "",
                "accounts": result.account_names,
                "numberAccounts": result.account_names.length
            });
        } catch (error) {
            shell.echo("---------ERROR---------");
            shell.echo(error);
            res.status(500).json({
                "error": "invalid prodKey",
                "accounts": [],
                "numberAccounts": -1
            });
        }
    } else {
        res.status(400).json({
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
    
    if (producer) {
        var accountName = producer.name;
        var ownerPubKey = producer.ownerPublicKey;
        var activePubKey = producer.activePublicKey;

        // Running teclos commands
        const teclosUnlockWallet = '/home/dev/telosfoundation/grow/grow.py wallet unlock';
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

        res.status(200).json({
            "error": "",
            "createAccountResult": createAccountResult,
            "transferResult": transferResult
        });

    } else {
        res.status(400).json({
            "error": "producer is undefined",
            "createAccountResult": "",
            "transferResult": ""
        });
    }

});

teclosRouter.route('/createaccount').post(async (req, res)=>{
    const SYMBOL = "TLOS";
    const CPU = "1000";
    const NET = "1000";
    const RAM = "1000";
    const AMOUNT = "1000";

    var account = req.body;
   
    if (account != null) {
      try {
        var accName = account.name;
        var accPubKey = account.pubKey;
  
        const teclosUnlockWallet = '/home/dev/telosfoundation/grow/grow.py wallet unlock';
        const createAccountCMD = `teclos system newaccount eosio ${accName} ${accPubKey} --stake-net "${NET}.0000 ${SYMBOL}" --stake-cpu "${CPU}.0000 ${SYMBOL}" --buy-ram "${RAM}.0000 ${SYMBOL}"`;
        var accPubKey = account.pubKey;
        
        if(!validateTLOSKey(accPubKey)) throw new Error("invalid public key");

        if(await !accountExists(accName)) throw new Error("account doesn't exist");

        shell.echo("---------START CREATING ACCOUNT---------");
        shell.exec(teclosUnlockWallet);
        shell.exec(createAccountCMD);
        shell.echo("---------END CREATING ACCOUNT---------");
        res.status(200).json({
            "account_created":true,
            "msg": "Account was created successfully",
            "account": accName,
            "pubKey": accPubKey
        });
      } catch (error) {
        shell.echo("---------ERROR CREATING ACCOUNT---------");
        res.status(500).json({
            "account_created":false,
            "msg": "Account name already exists or invalid public key",
            "account": "",
            "pubKey": ""
        });
      }
    } else {
        res.status(400).json({
            "account_created":false,
            "msg": "Bad request.",
            "account": "",
            "pubKey": ""
        });
    }

})

teclosRouter.route('/gettlos').post(async (req, res) => {
  const SYMBOL = 'TLOS';
  const MEMO = 'Transfer from TLOS Faucet';
  const AMOUNT = "100";

  var account = req.body;
  if (account != null) {
    try {
      var accName = account.name;
      
      //const teclosUnlockWallet = '/home/dev/telosfoundation/grow/grow.py wallet unlock';
      const teclosUnlockWallet = '/home/dev/telos-dev-test/grow/grow.py wallet unlock';
      const transferCMD = `teclos transfer eosio ${accName} "${AMOUNT}.0000 ${SYMBOL}" "${MEMO}"`;
      if(await !accountExists(accName)) throw new Error("account doesn't exist");
      
      shell.echo("---------START TRANSFER TLOS---------");
      shell.exec(teclosUnlockWallet);
      shell.exec(transferCMD);
      shell.echo("---------END TRANSFER TLOS-----------");

      res.status(200).json({"msg": "TLOS transfered successfully"});
    } catch (error) {
        shell.echo("---------ERROR TRANSFERING TLOS---------");
        res.status(500).json({"msg": "Teclos internal error"});
    }
  } else res.status(400).json({"msg": "Invalid parameters"});
})

module.exports = teclosRouter;
