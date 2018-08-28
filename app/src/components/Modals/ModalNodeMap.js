import React, {Component} from 'react';
import {Modal} from 'react-bootstrap';
import ProducerMap from '../ProducerMap';

import {MAPS_API_KEY} from '../../config/mapsConfig';

export default class ModalNodeMap extends Component {
	onModalHide(){
		this.props.onHide();
	}

	render(){
		console.log('map modal opened');
		return (
			<Modal
				{...this.props}
				bsSize="large"
				aria-labelledby="contained-modal-title-lg"
				id='map_modal'>
			  <Modal.Header closeButton>
			  	<h2>Node Map</h2>
			  </Modal.Header>
			  <Modal.Body>
		  		<ProducerMap
		  			producers={this.props.producers}
		  			loadingElement={<div style={{ height: `100%` }} />}
		  			containerElement={<div style={{ height: `800px` }} />}
		  			mapElement={<div style={{ height: `100%` }} />}
		  			googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${MAPS_API_KEY}`}
		  			ip_locations={this.props.ip_locations} />
			  </Modal.Body>
			</Modal>
		);
	}
}