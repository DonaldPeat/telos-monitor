const cron = require('node-cron');
const axios = require('axios');

const GeolocateModel = require('../db/models/geolocateModel');
const ProducerModel = require('../db/models/producerModel');

const IP_API_ENDPOINT = 'http://api.ipstack.com/';
const IP_API_KEY = process.env.IP_API_KEY;

const GEOCODE_ENDPOINT = 'https://api.opencagedata.com/geocode/v1/json';
const GEOCODE_API_KEY = process.env.GEOCODE_API_KEY;

//we will have to keep this updated to match netConfig file
const GET_PRODUCERS_ENDPOINT = 'http://localhost:8888/v1/chain/get_producers';

module.exports = {
	scheduleGeoTasks: function(){
		cron.schedule('*/5 * * * *', () => {
			this.getLatAndLong();
		});
	},
	getLatAndLong: function(){
		//check geo db for 1. entries exist, and 2. how recent, before proceeding
		const checkGeoDb = (initProducers, filterProducers) => {
			GeolocateModel.find({}, (error, items) => {
				if(error) console.log(error);
				//if empty, populate table
				if(items.length === 0){
					initProducers(filterProducers);
					console.log('initializing the geo db');
					return;
				}

				//they should all be entered at the same time, 
				//so the first item should have nearly the same timestamp as the rest
				const firstGeoItem = items[0];
				if(firstGeoItem){
					if(firstGeoItem.timestamp){

						//get time since db written
						const timeDbWritten = new Date(firstGeoItem.timestamp);
						const currentTime = new Date();
						const seconds = (currentTime.getTime() - timeDbWritten.getTime()) / 1000;
						
						//check if 30 minutes elapsed
						if(seconds > 900){
							console.log('replacing the geo db');
							GeolocateModel.remove({}, err => {
								if(err) console.log(err);
								else initProducers(filterProducers);
							});
						}else{
							console.log('its too soon to update the geo db');
						}
					}else{
						console.log('no timestamp, db probably old entries');
						GeolocateModel.remove({}, err => {
							if(err) console.log(err);
							else initProducers(filterProducers);
						});
					}
				}
			});
		};

		const initProducers = (filterProducers) => {
			//get array of producers from blockchain
			axios.post(
				GET_PRODUCERS_ENDPOINT,
				JSON.stringify({'json': true, 'limit': 1000})
			)
			.then(result => {
				if(result.data.rows){
					const activeProducers = result.data.rows.filter(bc => bc.is_active === 1);
					filterProducers(activeProducers, filterServerData);
				}
			})
			.catch(err => console.log(err));
		};

		//compare agains p2p list, from ProducerModal
		//data in p2p list is what we want, but in order of blockchain array
		const filterProducers = (bcProducers, filterServerData) => {
			//get p2p list
			ProducerModel.find({}, (error, p2pProds) => {
				if(error){
					console.log(error);
					return;
				}
				const bcProdsData = bcProducers.map(bcProd => {
					const indexOfProducer = p2pProds.indexOf(p2pProd => p2pProd.name === bcProd.owner);
					if(indexOfProducer > -1) return p2pProds[indexOfProducer];
					return null;
				}).filter(item => item != null);


				//use p2pProds for testing, but bcProdsData late on
				//filterServerData(p2pProds, updateIpData);
				filterServerData(bcProdsData, updateIpData);
			});
		};

		const filterServerData = (bcProducers, updateIpData) => {
			
			//get array of prod data {serverLocation, name, url, active}
			const bcProdServerData = bcProducers.map((bcProd, i) => {
				const thisProd = {
					serverLocation: bcProd.serverLocation,
					name: bcProd.name,
					url: '',
					active: false
				};
				if(i < 21) thisProd.active = true;
				if(bcProd.httpServerAddress === ''){
					thisProd.url = bcProd.httpsServerAddress.slice(0, bcProd.httpsServerAddress.indexOf(':'));
				}else{
					thisProd.url = bcProd.httpServerAddress.slice(0, bcProd.httpServerAddress.indexOf(':'));
				}
				return thisProd;
			});

			updateIpData(bcProdServerData);
		}


		//update data in db
		//involves checking if localhost (0.0.0.0), then using either ipstack or geocode api
		const updateIpData = (bcProducers) => {
			if(bcProducers.length < 1){
				console.log('No producers. Check if producers endpoint matches netConfig');
				return;
			}

			bcProducers.forEach(prod => {
				if(prod.url.indexOf('0.0.0.0') < 0){
					//not local, use ipstack to get coordinates of server
					axios.get(IP_API_ENDPOINT + prod.url, {
						params: {
							access_key: IP_API_KEY
						}
					})
					.then(res => {
						//we don't want to write to db if we don't have lat and long
						if(res.data.longitude != null && res.data.latitude != null){
							const geoModel = new GeolocateModel({
								ip: res.data.ip,
								name: prod.name,
								longitude: res.data.longitude,
								latitude: res.data.latitude,
								active: prod.active
							});
							geoModel.save();
						}
					})
					.catch(err => console.log(err));					

				}else{
					//local host, use geocode api to get coordinates of serverLocation
					axios.get(GEOCODE_ENDPOINT, {
						params: {
							key: GEOCODE_API_KEY,
							q: prod.serverLocation
						}
					})
					.then(res => {
						if(res.data.status.code == 200){
							if(res.data.longitude != null && res.data.latitude != null){
								const geoModel = new GeolocateModel({
									ip: prod.serverLocation,
									name: prod.name,
									longitude: res.data.results[0].geometry.lng,
									latitude: res.data.results[0].geometry.lat,
									active: prod.active
								});
								geoModel.save();
							}
						}
					})
					.catch(err => console.log(err));
				}
			});
		};

		//initialize.
		checkGeoDb(initProducers, filterProducers);
	}
}