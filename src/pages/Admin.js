import React from 'react';
import AdminEntryForm from '../components/AdminEntryForm';
import AdminSideMenu from '../components/AdminSideMenu';
import Styles from './Styles';

class Admin extends React.Component {
	state = {
		players: ['Vien', 'Mike', 'Steven'],
		fields: {
			ab: {
				value: '',
			},
			"1b": {
				value: '',
			},
			"2b": {
				value: '',
			},
			"3b": {
				value: '',
			},
			hr: {
				value: '',
			},
			rbi: {
				value: '',
			},
			r: {
				value: '',
			},
			bb: {
				value: '',
			},
			k: {
				value: '',
			},
		},
	};

	componentDidMount() {
		// fetch game data from Meetup api
		// game metadata, players attended
		// save to state or redux store
	}

	//handleFormChange = (changedFields) => {
	//	console.log('handleFormChange', changedFields);
	//	this.setState(({ fields }) => ({
	//		fields: { ...fields, ...changedFields },
	//	}));
	//};

	render() {
		const fields = this.state.fields;
		return (
			<div>
				<div style={Styles.adminPage}>
					<AdminSideMenu style={Styles.menu} />
					<AdminEntryForm players={this.state.players} />
				</div>
				<pre className="language-bash">
          			{JSON.stringify(fields, null, 2)}
        		</pre>
			</div>
		);
	}
}

export default Admin;
