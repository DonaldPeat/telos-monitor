const cron = require('node-cron');
const axios = require('axios');

const GeolocateModel = require('../db/models/geolocateModel');
const ProducerModel = require('../db/models/producerModel');

const IP_API_ENDPOINT = 'http://api.ipstack.com/';
const IP_API_KEY = '';

module.exports = {
	scheduleGeoTasks: function(){
		cron.schedule('0 1 * * *', () => {
			getLatAndLong();
		});
	},
	getLatAndLong: function(){
		const getProducerIps = (removeOldIpData) => {
			ProducerModel.find({}, (err, items) => {
				if(err){
					console.log(err);
				}else{
					const producerIps = items.map(acct => acct.httpServerAddress == '' ? acct.httpsServerAddress : acct.httpServerAddress);
					const addresses = producerIps.map(ip => ip.slice(0, ip.indexOf(':'))).filter(ip => ip != '0.0.0.0');
					removeOldIpData(updateIpData, addresses);
				}
			});
		};

		const removeOldIpData = (updateIpData, addresses) => {
			GeolocateModel.remove({}, err => {
				if(err) console.log(err);
				else updateIpData(addresses);
			});
		};

		const updateIpData = (addresses) => {
			addresses.forEach(ip => {
				axios.get(IP_API_ENDPOINT + ip, {
					params: {
						access_key: IP_API_KEY
					}
				})
				.then(res => {
					const geoModel = new GeolocateModel({
						ip: res.data.ip,
						longitude: res.data.longitude,
						latitude: res.data.latitude
					});
					geoModel.save();
				})
				.catch(err => console.log(err));
			});
		}

		getProducerIps(removeOldIpData);	
	}
};