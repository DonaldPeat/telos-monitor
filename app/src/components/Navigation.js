import React from 'react';
import {Link, withRouter} from 'react-router-dom';
import {Navbar, Nav, NavItem} from 'react-bootstrap';

const Navigation = (props) => {

	return (
		<Navbar fluid={true} collapseOnSelect>
		  <Navbar.Header>
		    <Navbar.Toggle />
		  </Navbar.Header>
		  <Navbar.Collapse>
			<Nav>
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