import React from 'react';
import Navigation from './Navigation';
import NodeInfo from './NodeInfo';
import header_background from '../img/Telos_MarketingSite_Header_2400px.png';

const Header = () => {

	return (
		<header style={{backgroundImage: `url(${header_background})`}} className='main_header'>
			<Navigation />
			
		</header>
	);
};

export default Header;