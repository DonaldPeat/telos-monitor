import axios from 'axios'
import netConfig from '../config/netConfig'
export default {
    getEndpointLatency: async (url) => {
        try {
            var result = await axios.post(netConfig.apiEndpoint + 'api/v1/latency', { host: url });
            return result.data;
        } catch (error) {
            console.error(error);
        }
    },

    registerProducerNode: (producer, cb) => {
        axios.post(netConfig.apiEndpoint + 'api/v1/producer', { producer: producer })
            .then((value) => {
                cb(value);
            })
            .catch((err) => console.error(err));
    },

    getAccount: (producerKey, cb) => {
        axios.get(netConfig.teclosEndpoint + 'api/v1/teclos/' + producerKey)
            .then(value => {
                cb(value);
            })
            .catch((err) => console.error(err));
    },

    getAllAccounts: (cb) => {
        axios.get(netConfig.apiEndpoint + 'api/v1/producer')
            .then((value) => {
                cb(value)
            })
            .catch((err) => console.error(err));
    }
}