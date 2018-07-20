import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Navbar, Nav, NavItem } from 'react-bootstrap';
import logo from '../img/Telos_MarketingSite_TelosLogo_500px.png';
import ModalRegisterProducer from './Modals/ModalRegisterProducer';

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
							<NavItem onClick={() => this.props.history.push('/status/stage-1')}>STATUS</NavItem>
							<NavItem onClick={() => this.showModalRegisterProducer()}>REGISTER</NavItem>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
				<ModalRegisterProducer show={this.state.showModalRegisterProd} onHide={() => this.showModalRegisterProducer()} />
			</div>
		);
	}
}

export default withRouter(Navigation);