var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProducerModel = new Schema({
    name: { type: String },
    organization: { type: String },
    serverLocation: { type: String },
    httpServerAddress: { type: String },
    httpsServerAddress: { type: String },
    p2pListenEndpoint: { type: String },
    p2pServerAddress: { type: String },
    producerPublicKey: { type: String },
    ownerPublicKey: { type: String },
    activePublicKey: { type: String },
    url: { type: String },
    telegramChannel: { type: String },
    psswrd: { type: String },
    totalBlockProduced: { type: String }
}, {
        collection: 'producers'
    }
);

module.exports = mongoose.model('ProducerModel', ProducerModel);
