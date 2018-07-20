import React from 'react';
import {Row, Col, Nav, NavItem, Button} from 'react-bootstrap';
import {Switch, Route, withRouter} from 'react-router-dom';
import '../styles/status.css';

const StatusPage = (props) => {
	return (
		<div className='status_page'>
		  <Nav bsStyle="pills" activeKey={props.location.pathname}>
		    <NavItem eventKey={'/status/stage-1'} onClick={() => props.history.push('/status/stage-1')}>
		      Stage 1
		    </NavItem>
		    <NavItem eventKey={'/status/stage-2'} onClick={() => props.history.push('/status/stage-2')}>
		      Stage 2
		    </NavItem>
		    <NavItem eventKey={'/status/stage-3'} onClick={() => props.history.push('/status/stage-3')}>
		      Stage 3
		    </NavItem>
		  </Nav>
		  <Row>
		  	<Col sm={12}>
		  		<Switch>
		  			<Route path='/status/stage-1' component={FirstStage} />
		  			<Route path='/status/stage-2' component={SecondStage} />
		  			<Route path='/status/stage-3' component={ThirdStage} />
		  		</Switch>
		  	</Col>
		  	<Col sm={12} className='text-left'>
		  		<Button href='/resources/statuslog.txt' className='testnet_status_btn' target='_blank' rel='noopener noreferrer'>View Testnet Status</Button>
		  	</Col>
		  </Row>
		</div>
	);
};

const FirstStage = () => {
	return (
		<div className='stage_status'>
			<h2>Stage 1</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis convallis at nisi at finibus. Aenean feugiat nulla arcu, in laoreet metus pellentesque mattis. Sed laoreet odio at viverra mollis. Ut vestibulum lacinia interdum. Sed nec lacus mattis, rutrum tortor quis, iaculis nulla. Nullam vestibulum leo diam, nec blandit ipsum porttitor id. Nulla auctor porta ex, ut convallis purus pretium ut. Fusce ultrices porttitor elit, id pulvinar dui. Aliquam eget metus at dui laoreet sollicitudin.</p>
		</div>
	);
};

const SecondStage = () => {
	return (
		<div className='stage_status'>
			<h2>Stage 2</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque hendrerit lorem a risus ullamcorper, eget eleifend risus venenatis. Etiam molestie est rutrum accumsan bibendum. Sed rutrum, magna eget dapibus posuere, risus ex maximus neque, vel lobortis magna leo eu leo. Vivamus non pellentesque nunc. Donec non finibus libero, sit amet convallis nisi. Praesent libero felis, tincidunt vitae interdum a, malesuada sit amet purus. Donec pharetra tortor ligula, a pulvinar velit faucibus id. Etiam venenatis tellus sit amet nunc dictum varius. Nam tincidunt metus tincidunt mauris congue congue. Duis facilisis libero nisl, quis tempus neque luctus et. Morbi et dignissim justo, a pharetra nisl. Sed rhoncus risus eget orci dignissim, at volutpat neque varius. In consectetur tincidunt mauris, sed dignissim odio ullamcorper sed. Cras lacinia nec massa ut pretium. Mauris hendrerit, nisl mattis accumsan efficitur, ipsum sapien lacinia turpis, a molestie turpis nulla ut erat. Duis ornare eget libero et ultricies.</p>
		</div>
	);
};

const ThirdStage = () => {
	return (
		<div className='stage_status'>
			<h2>Stage 3</h2>
			<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget blandit purus, sit amet facilisis purus. Nulla vestibulum eros vel nulla posuere semper. Quisque sagittis sodales convallis. Nam semper lectus id porttitor convallis. Maecenas tincidunt ultrices ipsum, vitae elementum nulla volutpat a. Sed at lobortis neque.</p>
		</div>
	);
};

export default withRouter(StatusPage);