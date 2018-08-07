import React, {Component} from 'react';
import {withScriptjs, withGoogleMap, GoogleMap,Marker, InfoBox, InfoWindow } from 'react-google-maps';
import mapStyles from '../mapStyles/telosStyle.json';
import marker_icon from '../img/marker_gif3.gif';

class ProducerMap extends Component {
	constructor(props){
		super(props);
		this.state = {
			open: false
		};
	}
	render(){
		const {ip_locations, producers} = this.props; 
		
		const get_markers = ip_locations.map((loc, i) => {
			
			if(typeof loc.latitude != 'number') return;

			const thisProd = producers.find(prod => prod.name === loc.name);

			return (<MarkerWithInfo key={i} loc={loc} producer={thisProd} />);
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

class MarkerWithInfo extends Component {
	constructor(props){
		super(props);
		this.state = {
			open: false
		};
	}
	render(){
		const {producer, loc} = this.props;
 		return (
			<Marker
				position={{lat: loc.latitude, lng: loc.longitude}}
				icon={marker_icon}
				onClick={() => this.setState({open: true})}>
				
				{/*get data for this server above*/}
 				{this.state.open && 
				<InfoWindow position={{lat: this.props.loc.latitude, lng: this.props.loc.longitude}}
			                onCloseClick={() => this.setState({open: false})}>
				    <div>
				    	<h4>{producer.name}</h4>
				    	<h5>{producer.organization}</h5>
				    	<table className='map_info_table'>
				    		<tr>
				    			<td>Server Address:</td>
				    			<td> {producer.httpServerAddress ? producer.httpServerAddress : producer.httpsServerAddress}</td>
				    		</tr>
				    		{producer.url ? 
				    			<tr>
					    			<td>URL:</td>
					    			<td> {producer.url}</td>
					    		</tr>
				    			: ''
				    		}
				    		{producer.p2pServerAddress ?
					    		<tr>
					    			<td>Peer Server Address:</td>
					    			<td>{producer.p2pServerAddress ? producer.p2pServerAddress : ''}</td>
					    		</tr>	
				    			: ''
				    		}
				    	</table>
 				    </div>
			    </InfoWindow>}
			</Marker>
		);
	}
}

export default withScriptjs(withGoogleMap(ProducerMap));
