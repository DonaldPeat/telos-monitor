var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountFaucetModel = new Schema({
    name: { type: String },
    timeRequested: { type: Number }
}, {
        collection: 'faucet'
    }
);

module.exports = mongoose.model('AccountFaucetModel', AccountFaucetModel);
