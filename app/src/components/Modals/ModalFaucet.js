//I think that's what it's called.  Faucet.
import React, {Component} from 'react';
import {Modal, Button, ButtonGroup, FormGroup, FormControl} from 'react-bootstrap';
import '../../styles/modal_faucet.css';

export default class ModalFaucet extends Component {
	constructor(){
		super();

		this.state = {
			TLOS: true, //vs tokens
			formSubmitted: false,
		};
	}

	onHide(){
		this.props.onHide();
	}

	handleSubmit(e){
		e.preventDefault();
	}

	renderForm(){
		return (
			<form>

			</form>
		);
	}

	renderSuccessMessage(){
		return (
			<div>success</div>
		);
	}

	render(){
		const {formSubmitted, TLOS} = this.state;

		return (
            <Modal
                {...this.props}
            >
                <Modal.Header closeButton>
                    <ButtonGroup className='pull-right'>
                    	<Button 
                    		className={TLOS ? 'faucet_btn faucet_selected' : 'faucet_btn'}
                    		onClick={() => this.setState({TLOS: true})}
                    	>
                    		TLOS
                    	</Button>
                    	<Button
                    		className={!TLOS ? 'faucet_btn faucet_selected' : 'faucet_btn'}
                    		onClick={() => this.setState({TLOS: false})}
                    	>
                    		Token
                    	</Button>
                    </ButtonGroup>
                </Modal.Header>
                <Modal.Body>
                	{!formSubmitted ? this.renderForm() : this.renderSuccessMessage()}
                </Modal.Body>
            </Modal>
		);
	}
}