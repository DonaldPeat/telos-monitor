import React, {Component} from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker} from 'react-google-maps';
import mapStyles from '../mapStyles/telosStyle.json';
import marker_icon from '../img/marker_gif3.gif';

class ProducerMap extends Component {

	render(){
		const {ip_locations} = this.props;
		const get_markers = ip_locations.map((loc, i) => {
			return (
				<Marker
					key={i}
					position={{lat: loc.latitude, lng: loc.longitude}}
					icon={marker_icon} />
			);
		});

		return (
			<GoogleMap
				defaultZoom={2}
				defaultCenter={{lat: 13.491665, lng: -92.508646}}
				defaultOptions={{styles: mapStyles}}>
				{get_markers}
			</GoogleMap>
		);
	}
}

export default withScriptjs(withGoogleMap(ProducerMap));