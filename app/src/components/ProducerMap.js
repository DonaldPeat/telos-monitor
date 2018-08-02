import React, {Component} from 'react';
import {
	withScriptjs, 
	withGoogleMap, 
	GoogleMap, 
	Marker,
	InfoBox,
	InfoWindow } from 'react-google-maps';
import mapStyles from '../mapStyles/telosStyle.json';
import marker_icon from '../img/marker_gif3.gif';

class ProducerMap extends Component {
	constructor(){
		super();
		this.state = {
			open: false
		};
	}

	render(){
		const {ip_locations, producers} = this.props;
		
		const get_markers = ip_locations.map((loc, i) => {
			if(typeof loc.latitude != 'number') return;
			return (
				<Marker
					key={i}
					position={{lat: loc.latitude, lng: loc.longitude}}
					icon={marker_icon}>
				</Marker>
			);
		});

		return (
			<GoogleMap
				defaultZoom={2}
				defaultCenter={{lat: 13.491665, lng: -92.508646}}
				defaultOptions={{
					styles: mapStyles
				}}>
				{get_markers}
			</GoogleMap>
		);
	}
}

export default withScriptjs(withGoogleMap(ProducerMap));