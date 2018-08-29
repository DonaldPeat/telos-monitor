import React, {Component} from 'react';
import {withScriptjs, withGoogleMap, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/components/addons/MarkerClusterer';
import mapStyles from '../mapStyles/telosStyle.json';
import marker_icon from '../img/active_marker.gif';
import inactive_icon from '../img/inactive_marker.gif';
import cluster_icon from '../img/cluster_icon.png';

const clusterStyle = [
	{ 
		textColor: 'white', 
		height: 53, 
		url: cluster_icon, 
		width: 53,
		anchorText: [-9.75, -10.25]
	}, 
	{ 
		textColor: 'white', 
		height: 56, 
		url: cluster_icon, 
		width: 56,
		anchorText: [-9.75, -10.25] 
	}, 
	{ 
		textColor: 'white', 
		height: 66, 
		url: cluster_icon, 
		width: 66,
		anchorText: [-9.75, -10.25]
	}, 
	{ 
		textColor: 'white', 
		height: 78, 
		url: cluster_icon, 
		width: 78, 
		anchorText: [-9.75, -10.25]
	}, 
	{ 
		textColor: 'white', 
		height: 90, 
		url: cluster_icon, 
		width: 90, 
		anchorText: [-9.75, -10.25]
	}
];

const ProducerMap = ({ip_locations, producers}) => {
	let get_markers = [];
	if(ip_locations.length > 0){
		get_markers = ip_locations.map((loc, i) => {
			if(!loc) return;
			if(typeof loc.latitude != 'number') return;
			const thisProd = producers.find(prod => prod.name === loc.name);
			return (<MarkerWithInfo key={i} loc={loc} producer={thisProd} />);
		});
	}

	return (
		<GoogleMap
			onClick={e => console.log(e)}
			defaultZoom={2}
			defaultCenter={{lat: 13.491665, lng: -92.508646}}
			defaultOptions={{
				styles: mapStyles
			}}>
			    <MarkerClusterer
			      styles={clusterStyle}
			      averageCenter
			      enableRetinaIcons
			      gridSize={15}
			    >
					{get_markers}
				</MarkerClusterer>
		</GoogleMap>
	);
};

class MarkerWithInfo extends Component {
	constructor(props){
		super(props);
		this.state = {
			open: false,
			infoBoxOpen: false
		};
	}
  
	render(){
		const {producer, loc} = this.props;
 		return (
			<Marker
				position={{lat: loc.latitude, lng: loc.longitude}}
				icon={loc.active ? marker_icon : inactive_icon}
				onClick={() => this.setState({open: true})}>
				
				{/*get data for this server above*/}
 				{this.state.open && 
				<InfoWindow position={{lat: this.props.loc.latitude, lng: this.props.loc.longitude}}
			                onCloseClick={() => this.setState({open: false})}>
				    <div style={{position: 'relative'}}>
				    	<h4>{producer.name}</h4>
				    	<h5>{producer.organization}</h5>
				    	<table className='map_info_table'>
				    		<tbody>
					    		<tr>
					    			<td>Server Address:</td>
					    			<td> 
					    				{producer.httpServerAddress ? producer.httpServerAddress : producer.httpsServerAddress}&nbsp; 
					    				<i 
					    					className='fa fa-info-circle' 
					    					onClick={(e) => {
					    						const iconRect = e.target.getBoundingClientRect();
					    						this.setState({infoBoxOpen: !this.state.infoBoxOpen});
					    					}}
					    				></i>
										{this.state.infoBoxOpen &&
											<span> 
												<br /><p>Location info from block producer registration</p>
											</span>
										}
					    			</td>
					    		</tr>
					    		{producer.url ? 
					    			<tr>
						    			<td>URL:</td>
						    			<td><a href={producer.url} target="_blanket">{producer.url}</a> </td>
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
				    		</tbody>
				    	</table>
 				    </div>
			    </InfoWindow>}
			</Marker>
		);
	}
}

export default withScriptjs(withGoogleMap(ProducerMap));