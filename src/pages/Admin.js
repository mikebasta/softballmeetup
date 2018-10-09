import React from 'react';
import { API } from 'aws-amplify';
import { Utils } from "../utils";
import AdminSideMenu from '../components/AdminSideMenu';
import AdminStatsTable from '../components/AdminStatsTable';

class Admin extends React.Component {
	constructor() {
		super();
		this.state = {
			// temporarily make mock data
			data: Utils.makeData()
		};
	}
  
  async componentDidMount(){
		let data = await API.get('playerstatsCRUD', '/playerstats/');
		console.log('data', data);
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		let data = API.get('playerstatsCRUD', '/playerstats/');
		console.log('data', data);
		if(prevState.data[0].id !== this.state.data[0].id){
			this.setState({data});
		}
		//console.log('did update', { prevProps, prevState, snapshot });
	}

	handleSubmitData = (data) => {
		// hit the submit button
		// send state.data to server to update
		console.log('handleSubmitData', data);
		const playerstats = {
			id: 9,
			userId: 'testUserId',
			"1b": 4
		}
		API.post('playerstatsCRUD', '/playerstats', {body: playerstats});

	};

	render() {
		const { data } = this.state;
		return (
			<div className="admin-form">
				<AdminSideMenu />
				<AdminStatsTable data={data} onSubmit={this.handleSubmitData} />
			</div>
		);
	}
}

export default Admin;
