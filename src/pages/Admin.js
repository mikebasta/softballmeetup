import React from 'react';
import { makeData } from "../utils/Utils";
import AdminSideMenu from '../components/AdminSideMenu';
import AdminStatsTable from '../components/AdminStatsTable';

class Admin extends React.Component {
	constructor() {
		super();
		this.state = {
			// temporarily make mock data
			data: makeData()
		};
	}

	componentDidMount() {
		// fetch data from Meetup API
		// game info like field, game number, number of players
		// player list name and image
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		console.log('did update', { prevProps, prevState, snapshot });
	}

	handleSubmitData = () => {
		// hit the submit button
		// send state.data to server to update
	};

	render() {
		const { data } = this.state;
		return (
			<div className="admin-form">
				<AdminSideMenu />
				<AdminStatsTable data={data} />
			</div>
		);
	}
}

export default Admin;
