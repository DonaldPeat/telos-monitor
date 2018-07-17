import React, {Component} from 'react';
import {Row, Col, Modal, Button} from 'react-bootstrap';
import NodeInfo from './NodeInfo';

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
			        <Button bsStyle="primary" bsSize="large" onClick={this.handleShow}>
			          Launch demo modal
			        </Button>
	        	</Col>
	        </Row>

	        <Modal show={this.state.show} onHide={this.handleClose}         
				{...this.props}
       			bsSize="large"
        		aria-labelledby="contained-modal-title-lg">
	          <Modal.Header closeButton>
	            <Modal.Title>Modal heading</Modal.Title>
	          </Modal.Header>
	          <Modal.Body>
	

	            <hr />

	            <h4>Overflowing text to show scroll behavior</h4>

	            <p>
	              Praesent commodo cursus magna, vel scelerisque nisl consectetur
	              et. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor
	              auctor.
	            </p>
	            <p>
	              Aenean lacinia bibendum nulla sed consectetur. Praesent commodo
	              cursus magna, vel scelerisque nisl consectetur et. Donec sed odio
	              dui. Donec ullamcorper nulla non metus auctor fringilla.
	            </p>
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