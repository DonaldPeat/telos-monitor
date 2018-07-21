import React, {Component} from 'react';
import Remarkable from 'remarkable';
import axios from 'axios';
import {Modal, Button, Row, Col} from 'react-bootstrap';

const md = new Remarkable();

export default class ModalStatus extends Component {
	constructor(props){
		super(props);
		this.state={
			status: null
		};
	}

	componentDidMount(){
		axios.get('/resources/statuslog.md')
		.then(res => this.setState({status: res.data}))
		.catch(err => console.log(err));
	}

    onModalHide() {
        this.props.onHide();
    }	

	render(){
		const {status} = this.state;
		return (
            <Modal
                {...this.props}
                bsSize="large"
                aria-labelledby="contained-modal-title-lg"
            >
            	<Modal.Header closeButton>
            		<h2>Telos Testnet Status Log</h2>
            	</Modal.Header>
            	<Modal.Body>
            		<div dangerouslySetInnerHTML={{ __html: md.render(status) }} />
            	</Modal.Body>
            	<Modal.Footer>
                    <Button onClick={() => this.onModalHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
		);
	}
}