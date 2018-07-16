import React, {Component} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import axios from 'axios';

const MAPS_API_KEY = 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo';
const IP_API_ENDPOINT = 'http://ip-api.com/json/';

const ipRegex = new RegExp(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]):[0-9]+$/g);

const mapStyle = {
	position: 'relative',
	width: '1200px',
	height: '100%',
	maxWidth: '100%',
	display: 'block',
	margin: '0 auto'
};

class ProducerMap extends Component {

	constructor(props){
		super(props);

		this.state = {
			ip_locations: []
		};
	}
componentWillUpdate(){
	console.log("2");
}
	componentDidMount(){ console.log("here")
		console.log(this.props.accounts);
		const httpAddresses = this.props.accounts.map(acct => acct.httpServerAddress == '' ? acct.httpsServerAddress : acct.httpServerAddress);
		console.log(httpAddresses);
		const filteredIps = httpAddresses.map(ip => ip.slice(0, ip.indexOf(':')))
								 		 .filter(ip => ip != '0.0.0.0');

		console.log(filteredIps);
		filteredIps.forEach(ip => {
			axios.get(IP_API_ENDPOINT + ip)
			.then(res => {
				const arr = this.state.ip_locations;
				arr.push(res.data);
				this.setState({ip_locations: arr});
			})
			.catch(err => console.log(err));
		});
	}


	shouldComponentUpdate(nextProps, nextState){ 
		const {ip_locations} = this.state;
		//if we have all the stuff, don't update
		if(ip_locations.length  !== 0){ 
			console.log("1")
			this.setState({ip_locations: ip_locations});
			return false;
	} 
}

	render(){
		const {ip_locations} = this.state;
		const get_markers = ip_locations.map((loc, i) => {
			return (
				<Marker
					key={i}
					position={{lat: loc.lat, lng: loc.lon}} />
			);
		});

		return (
			<div>
				<h2>Node Map</h2>
				<div style={{position: 'relative', width: 'auto', height: '500px', paddingTop: '50px'}}>
					<Map google={this.props.google} zoom={2} style={mapStyle}>
						{get_markers}
						<InfoWindow onClose={this.onInfoWindowClose}>
						    <div>
						      <h1>This location</h1>
						    </div>
						</InfoWindow>
					</Map>
			    </div>
			</div>
	    );
	}
}

const LoadingContainer = () => {
	return (
		<div>Loading Map...</div>
	);
};

export default GoogleApiWrapper({
	LoadingContainer: LoadingContainer,
	apiKey: MAPS_API_KEY
})(ProducerMap);