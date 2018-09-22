import React from 'react';
import AdminEntryForm from '../components/AdminEntryForm';
import AdminSideMenu from '../components/AdminSideMenu';
import './pages.css';

class Admin extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			players: ['Vien', 'Mike', 'Steven', 'Michael'],
			fields: {
				o: '',
				"1b": '',
				"2b": '',
				"3b": '',
				hr: '',
				rbi: '',
				r: '',
				bb: '',
				k: '',
				sb: '',
				cs: '',
				ab: '',
			},
		};
	}

	componentDidMount() {
		// fetch game data from Meetup api
		// game metadata, players attended
		// save to state or redux store
	}

	handleFormChange = (players) => {
		//console.log('handleFormChange', players);
		this.setState(() => ({
			playerStats: players,
		}));
	};

	render() {
		const { fields, players, playerStats } = this.state;
		return (
			<div>
				<div className="admin-page">
					<AdminSideMenu />
					<AdminEntryForm
						players={players}
						fields={fields}
						onChange={this.handleFormChange}
					/>
				</div>
				<pre className="language-bash">
          			{JSON.stringify(playerStats, null, 2)}
        		</pre>
			</div>
		);
	}
}

export default Admin;
