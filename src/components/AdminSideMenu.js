import React from 'react';
import { Menu } from 'antd';
import 'antd/dist/antd.css';

class AdminSideMenu extends React.Component {
	handleClick = (e) => {
		console.log('click ', e);
	};

	render() {
		return (
			<Menu
				onClick={this.handleClick}
				style={this.props.style}
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
