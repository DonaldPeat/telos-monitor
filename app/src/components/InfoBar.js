import React, {Component} from 'react';
import {Row, Col, Modal, Button, ButtonToolbar} from 'react-bootstrap';
import NodeInfo from './NodeInfo';
import ProducerMap from './ProducerMap';
import serverAPI from '../scripts/serverAPI';
import axios from 'axios';
import ModalStatus from './Modals/ModalStatus';

import {MAPS_API_KEY} from '../config/mapsConfig';

//might need to change this
const GEOLOCATE_ENDPOINT = 'http://localhost:4200/api/v1/geolocate';

export default class InfoBar extends Component {
	constructor(props, context){
		super(props, context);

		this.state = { 
			show: false,
			showStatus: false,
			ip_locations: []
		};
	}
	componentDidMount(){
		axios.get(GEOLOCATE_ENDPOINT)
		.then(res => this.setState({ip_locations: res.data }))
		.catch(err => console.log(err));
	}

	render(){

    	return (
			<div>
				<Row>
					<Col sm={6}>
						<NodeInfo />
					</Col>
					<Col sm={6}>
						<ButtonToolbar style={{float: 'right'}}>
				    		<Button className='testnet_status_btn' bsStyle="primary" onClick={() => this.setState({showStatus: true})}>
				    			Testnet Status
				    		</Button>
					        <Button bsStyle="default" onClick={() => this.setState({show: true})}>
					          Node Map
					        </Button>
				        </ButtonToolbar>
					</Col>
				</Row>
				<ModalStatus show={this.state.showStatus} onHide={() => this.setState({showStatus: false})} />
				<Modal show={this.state.show} onHide={() => this.setState({show: false})}         
					{...this.props}
						bsSize="large"
					aria-labelledby="contained-modal-title-lg">
				  <Modal.Header closeButton>
				  	<h2>Node Map</h2>
				  </Modal.Header>
				  <Modal.Body>
				  	{this.state.ip_locations.length > 0 ? 
				  		<ProducerMap 
				  			loadingElement={<div style={{ height: `100%` }} />}
				  			containerElement={<div style={{ height: `800px` }} />}
				  			mapElement={<div style={{ height: `100%` }} />}
				  			googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${MAPS_API_KEY}`}
				  			ip_locations={this.state.ip_locations} /> 
				  		: 
				  		<div>Getting Nodes...</div>
				  	}
				  </Modal.Body>
				</Modal>
			</div>
     	);
	}
}