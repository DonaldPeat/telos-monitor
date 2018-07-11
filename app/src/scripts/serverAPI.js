import axios from 'axios'

export default {
    getEndpointLatency: async (url) => {
        try {
            var result = await axios.post('http://localhost:4200/api/v1/latency', { host: url });
            return result.data;
        } catch (error) {
            console.error(error);
        }
    },

    registerProducerNode: (producer, cb) => {
        axios.post('http://localhost:4200/api/v1/producer', { producer: producer })
            .then((value) => {
                cb(value);
            })
            .catch((err) => console.error(err));
    },

    getAllAccounts: (cb) => {
        axios.get('http://localhost:4200/api/v1/producer')
            .then((value) => {
                cb(value)
            })
            .catch((err) => console.error(err));
    }
}