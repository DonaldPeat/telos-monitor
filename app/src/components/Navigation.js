import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import logo from '../img/Telos_MarketingSite_TelosLogo_500px.png';
import ModalRegisterProducer from './Modals/ModalRegisterProducer';
import ModalCreateAccount from './Modals/ModalCreateAccount';
import ModalFaucet from './Modals/ModalFaucet';

class Navigation extends Component {
	constructor(props) {
		super(props);
		this.state = {}
	}

	showModalRegisterProducer() {
		this.setState({
			showModalRegisterProd: !this.state.showModalRegisterProd
		});
	}

	showModalCreateAccount() { console.log("hi")
		this.setState({
			showModalCreateAccount: !this.state.showModalCreateAccount
		});
	}

	showModalFaucet(){
		this.setState({
			showModalFaucet: !this.state.showModalFaucet
		});
	}


	render() {
		return (
			<div>
				<Navbar fluid={true} collapseOnSelect>
					<Navbar.Header>
						<Navbar.Toggle />
						<Navbar.Brand>
							<a href='https://telosfoundation.io'>
								<img src={logo} alt='logo' className='img-responsive logo' />
							</a>
						</Navbar.Brand>
					</Navbar.Header>
					<Navbar.Collapse>
						<Nav pullRight>
							<NavItem onClick={() => this.props.history.push('/info')}>INFO</NavItem>
							<NavItem onClick={() => this.props.history.push('/')}>PRODUCERS</NavItem>
							<NavItem onClick={() => this.props.history.push('/blocks')}>BLOCKS</NavItem>
							<NavItem onClick={() => this.props.history.push('/transactions')}>TRANSACTIONS</NavItem>
							<NavItem onClick={() => this.props.history.push('/p2plist')}>P2P LIST</NavItem>
							{/* <NavItem onClick={() => this.props.history.push('/stages/stage-1')}>STAGES</NavItem> */}
							<NavItem onClick={() => this.showModalRegisterProducer()}>REGISTER</NavItem>
							{/* <NavItem onClick={() => this.showModalCreateAccount()} >CREATE ACCOUNT</NavItem> */}
							<NavItem onClick={() => this.showModalFaucet()}>FAUCET</NavItem>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<ModalCreateAccount show={this.state.showModalCreateAccount} onHide={() => this.showModalCreateAccount()} />
				<ModalRegisterProducer show={this.state.showModalRegisterProd} onHide={() => this.showModalRegisterProducer()} />
				<ModalFaucet show={this.state.showModalFaucet} onHide={() => this.showModalFaucet()} />
			</div>
		);
	}
}

export default withRouter(Navigation);