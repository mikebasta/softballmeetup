import React from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';

class AdminSideMenu extends React.Component {
	handleClick = (e) => {
		console.log('click ', e);
	};

	render() {
		const sideMenuStyle = {
			width: 300,
			height: 400,
			boxShadow: '0 0 8px 1px rgba(0, 0, 0, 0.1)',
		};

		return (
			<Menu
				onClick={this.handleClick}
				style={sideMenuStyle}
				defaultSelectedKeys={['1']}
				defaultOpenKeys={['sub1']}
				mode="inline"
			>
				<Menu.Item key="1">Game Stats</Menu.Item>
				<Menu.Item key="2">Player Stats</Menu.Item>
			</Menu>
		);
	}
}

export default AdminSideMenu;
