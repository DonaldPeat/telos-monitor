import React from 'react';
import Navigation from './Navigation';
import header_background from '../img/header_curved.png';

const Header = () => {

	return (
		<header style={{backgroundImage: `url(${header_background})`}} className='main_header'>
			<Navigation />
		</header>
	);
};

export default Header;