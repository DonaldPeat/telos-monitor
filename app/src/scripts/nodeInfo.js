import axios from 'axios'
import config from '../config/netConfig'

export default {
    getInfo: async () => {
        try {
            var response = await axios.get(config.endPoint + 'v1/chain/get_info');
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getProducers: async () => {
        try {
            var response = await axios.post(config.endPoint + 'v1/chain/get_producers',
                JSON.stringify({
                    "json": true,
                    "limit": 1000
                }));
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getBlockInfo: async (num) => {
        try {
            var response = await axios.post(config.endPoint + 'v1/chain/get_block',
                JSON.stringify({
                    'block_num_or_id': num
                }));
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getBlockHeaderState: async (num) => {
        try {
            var response = await axios.post(config.endPoint + 'v1/chain/get_block_header_state',
                JSON.stringify({
                    'block_num_or_id': num
                }));
            return response.data;
        } catch (error) {
            console.error(error);
        }
    },

    getAccountInfo: async (accountName) => {
        try {
            var response = await axios.post(config.endPoint + 'v1/chain/get_account',
                JSON.stringify({
                    'account_name': accountName
                }));
            return response.data;
        } catch (error) {
            console.error(error);
        }
    }
}