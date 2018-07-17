import React, {Component} from 'react';
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import marker_icon from '../img/location-pointer.png';

const MAPS_API_KEY = 'AIzaSyAyesbQMyKVVbBgKVi2g6VX7mop2z96jBo';


const mapStyle = {
	position: 'relative',
	width: '1200px',
	height: '100%',
	maxWidth: '100%',
	display: 'block',
	margin: '0 auto'
};

const mapContainerStyle = { 
	position: 'relative',
	width: 'auto',
	height: '500px',
	paddingTop: '50px'
};

const ProducerMap = (props) => {
	const {ip_locations} = props;
	const get_markers = ip_locations.map((loc, i) => {
		return (
			<Marker
				key={i}
				position={{lat: loc.latitude, lng: loc.longitude}}
				icon={marker_icon} />
		);
	});

	return (
		<div>
			<h2>Node Map</h2>
			<div style={mapContainerStyle}>
				<Map google={props.google} zoom={2} style={mapStyle}>
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
};

const LoadingContainer = () => {
	return (
		<div>Loading Map...</div>
	);
};

export default GoogleApiWrapper({
	LoadingContainer: LoadingContainer,
	apiKey: MAPS_API_KEY
})(ProducerMap);