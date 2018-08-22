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
                aria-labelledby='contained-modal-title-lg'
            >
            	<Modal.Header closeButton>
            		<h2>Telos testnet status log</h2>
            	</Modal.Header>
            	<Modal.Body>
					<Row>
						<Col sm={12}>
							<h4>Node version: 39543a30</h4>
						</Col>
						<Col sm={12}>
							<div className="status">
								<p>
								Welcome to test net stage 2.0! We’ve completed setup and are ready to onboard new producers. Please follow the instructions under the info button. If you find any bugs please either create an issue on the Telos Github repository or speak to someone on Slack or Telegram. The github project board or issue tracker will list all the most <a href="https://github.com/Telos-Foundation/telos/projects/1" target="_blank">recent changes</a>.
								</p>
							</div>
						</Col>
					</Row>
            	</Modal.Body>
            	<Modal.Footer>
                    <Button onClick={() => this.onModalHide()}>Close</Button>
                </Modal.Footer>
            </Modal>
		);
        }
}