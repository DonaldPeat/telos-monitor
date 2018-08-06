import React, {Component} from 'react';
import {Button, ButtonToolbar, Col, Modal, Row} from 'react-bootstrap';

import serverAPI from '../scripts/serverAPI';

import ModalNodeMap from './Modals/ModalNodeMap';
import ModalStatus from './Modals/ModalStatus';
import NodeInfo from './NodeInfo';

export default class InfoBar extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {show: false, showStatus: false, ip_locations: [], producers: []};
  }

  componentDidMount() {
    serverAPI.getIpLocations((res) => {
      this.setState({ip_locations: res.data});

    });

    serverAPI.getAllAccounts(res => {
	  this.setState((prevState, nextState)=>({producers: res.data}));
	});

  }

  render() {
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
					        <Button bsStyle='default' onClick={() => this.setState({show: true})}>
					          Node Map
					        </Button>
				        </ButtonToolbar>
					</Col>
				</Row>
				<ModalStatus show={this.state.showStatus} onHide={() => this.setState({showStatus: false})} />
				<ModalNodeMap ip_locations={this.state.ip_locations} producers={this.state.producers} show={this.state.show} onHide={() => this.setState({show: false})} />
			</div>
     	);
	}
}