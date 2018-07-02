var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountModel = new Schema({
    account: {
        name: String,
        ownerPubKey: String,
        activePubKey: String
    },

}, {
        collection: 'accounts'
    });

module.exports = mongoose.model('AccountModel', AccountModel);
