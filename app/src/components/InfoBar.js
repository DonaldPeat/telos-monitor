import React, {Component} from 'react';
import {Row, Col, Modal, Button} from 'react-bootstrap';
import NodeInfo from './NodeInfo';
import ProducerMap from './ProducerMap';

export default class InfoBar extends Component {
	constructor(props, context){
		super(props, context);

		this.handleShow = this.handleShow.bind(this);
		this.handleClose = this.handleClose.bind(this);

		this.state = { show: false};
	}
	handleClose() {
		this.setState({ show: false });
	}

	handleShow() {
		this.setState({ show: true });
	}

	render(){

     return (
     	<div>
	        <Row>
	        	<Col sm={6}>
	        		<NodeInfo />
	        	</Col>
	        	<Col sm={6}>
			        <Button bsStyle="default" className='pull-right' onClick={this.handleShow}>
			          Node Map
			        </Button>
	        	</Col>
	        </Row>

	        <Modal show={this.state.show} onHide={this.handleClose}         
				{...this.props}
       			bsSize="large"
        		aria-labelledby="contained-modal-title-lg">
	          <Modal.Header closeButton></Modal.Header>
	          <Modal.Body>
	          	<ProducerMap />
	          </Modal.Body>
	          <Modal.Footer>
	            <Button onClick={this.handleClose}>Close</Button>
	          </Modal.Footer>
	        </Modal>
	      </div>
      );
	}
}

/*class Example extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.handleShow = this.handleShow.bind(this);
    this.handleClose = this.handleClose.bind(this);

    this.state = {
      show: false
    };
  }



  render() {


    return (

    );
  }
}

render(<Example />);*/