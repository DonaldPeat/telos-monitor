const cron = require('node-cron');
const axios = require('axios');

const GeolocateModel = require('../db/models/geolocateModel');
const ProducerModel = require('../db/models/producerModel');

const IP_API_ENDPOINT = 'http://api.ipstack.com/';
const IP_API_KEY = process.env.IP_API_KEY;

const GEOCODE_ENDPOINT = 'https://api.opencagedata.com/geocode/v1/json';
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

module.exports = {
	scheduleGeoTasks: function(){
		cron.schedule('*/15 * * * *', () => {
			this.getLatAndLong();
		});
	},
	getLatAndLong: function(){
		const getProducerIps = (removeOldIpData) => {
			ProducerModel.find({}, (err, items) => {
				if(err){
					console.log(err);
				}else{
					const addresses = items.slice(0, 21).map(acct => {
						if(acct.httpServerAddress == ''){
							return {
								serverLocation: acct.serverLocation,
								name: acct.name,
								url: acct.httpsServerAddress.slice(0, acct.httpsServerAddress.indexOf(':'))
							};
						}else{
							return {
								serverLocation: acct.serverLocation,
								name: acct.name,
								url: acct.httpServerAddress.slice(0, acct.httpServerAddress.indexOf(':'))
							};
						}
					});
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

				//check if local host.  bad method, will change later
				if(ip.url.indexOf('0.0.0.0') < 0){
					
					axios.get(IP_API_ENDPOINT + ip.url, {
						params: {
							access_key: IP_API_KEY
						}
					})
					.then(res => {
						const geoModel = new GeolocateModel({
							ip: res.data.ip,
							name: ip.name,
							longitude: res.data.longitude,
							latitude: res.data.latitude
						});
						geoModel.save();
					})
					.catch(err => console.log(err));
				
				//try to get coordinates from server location
				}else{
					axios.get(GEOCODE_ENDPOINT, {
						params: {
							key: GEOCODE_API_KEY
						}
					})
					.then(res => {
						if(res.data.status.code == 200){
							const geoModel = new GeolocateModel({
								ip: ip.serverLocation,
								name: ip.name,
								longitude: res.data.results[0].geometry.lng,
								latitude: res.data.results[0].geometry.lat
							});
							geoModel.save();
						}
					})
					.catch(err => console.log(err));
				}
			});
		}

		getProducerIps(removeOldIpData);	
	}
};
