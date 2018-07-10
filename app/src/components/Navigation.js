import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';
import logo from '../img/Telos_MarketingSite_TelosLogo_500px.png';

const Navigation = (props) => {

	return (
		<Navbar fluid={true} collapseOnSelect>
		  <Navbar.Header>
		    <Navbar.Toggle />
		    <Navbar.Brand>
		      <a href='#' onClick={(e) => {
		      	e.preventDefault();
		      	props.history.push('/');
		      }}>
		      	<img src={logo} alt='logo' className='img-responsive logo' />
		      </a>
		    </Navbar.Brand>
		  </Navbar.Header>
		  <Navbar.Collapse>
			<Nav pullRight>
				<NavItem onClick={() => props.history.push('/')}>
					PRODUCERS
				</NavItem>
				<NavItem onClick={() => props.history.push('/blocks')}>
					BLOCKS
				</NavItem>
				<NavItem onClick={() => props.history.push('/transactions')}>
					TRANSACTIONS
				</NavItem>
			</Nav>
		  </Navbar.Collapse>
		</Navbar>
	);
};

export default withRouter(Navigation);