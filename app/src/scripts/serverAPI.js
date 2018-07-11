import axios from 'axios'

export default {
    getEndpointLatency: async (url) => {
        try {
            var result = await axios.post('http://telos01.telosseattle.com:4200/api/v1/latency', { host: url + "/bp.json" });
            return result.data;
        } catch (error) {
            console.error(error);
        }
    },

    registerProducerNode: (producer, cb) => {
        axios.post('http://telos01.telosseattle.com:4200/api/v1/producer', { producer: producer })
            .then((value) => {
                cb(value);
            }).catch((err) => console.error(err));
    }
}