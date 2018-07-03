var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var AccountModel = new Schema({
    name: { type: String },
    ownerPubKey: { type: String },
    activePubKey: { type: String }
}, {
        collection: 'accounts'
    }
);

module.exports = mongoose.model('AccountModel', AccountModel);
