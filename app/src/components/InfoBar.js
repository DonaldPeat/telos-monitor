import React, {Component} from 'react';
import {Row, Col, Modal, Button, ButtonToolbar} from 'react-bootstrap';
import NodeInfo from './NodeInfo';
import serverAPI from '../scripts/serverAPI';
import ModalStatus from './Modals/ModalStatus';
import ModalNodeMap from './Modals/ModalNodeMap';

export default class InfoBar extends Component {
	constructor(props, context){
		super(props, context);

		this.state = { 
			show: false,
			showStatus: false,
			ip_locations: [],
			producers: []
		};
	}
  
	componentDidMount(){
		serverAPI.getIpLocations((res) => {
			console.log({myData: res.data});
			this.setState({ip_locations: seperateIdenticalCoords(res.data)});
		
		serverAPI.getAllAccounts(res => {
			this.setState({producers: res.data});
		});
	});
}

	render(){
		const {producers} = this.state;
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
				<ModalNodeMap producers={producers} ip_locations={this.state.ip_locations} show={this.state.show} onHide={() => this.setState({show: false})} />
			</div>
     	);
	}
}

//need to seperate nodes that have the same coordinates
function seperateIdenticalCoords(ip_locations){
	const N = ip_locations.length;
	const newIp_locations = [];
	for(let i = 0; i < N - 1; i++){
		const thisIp = ip_locations[i];
		for(let j = i + 1; j < N; j++){
			const otherIp = ip_locations[j];
			
			//if coords are identical...
			if( thisIp.longitude === otherIp.longitude &&
				thisIp.latitude === otherIp.latitude){
				thisIp.longitude += 0.00001;
				thisIp.latitude += 0.00001;
				break;
			}
		}
		newIp_locations.push(thisIp);
	}
	newIp_locations.push(ip_locations[N - 1]);
	return newIp_locations;
}