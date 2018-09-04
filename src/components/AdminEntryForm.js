import React from 'react';
import PlayerStatForm from './PlayerStatForm';
import Styles from './Styles';

const fields = {
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
};

class AdminEntryForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			players: this.setPlayerFields(props.players),
		};
	}

	/**
	 * set up state => [{ player1: { fields: {} } }, { player2: { fields: {} } }]
	 * @param {Array} players: list of players attended
	 * @return [Array] list of players mapped with fields data
	 */
	setPlayerFields = (players) => players.map(player => ({ name: player, fields }));

	handleFormChange = (updatedFields, name) => {
		this.setState(({ players }) => {
			const currentPlayer = players.find((player) => player.name === name);
			currentPlayer.fields = updatedFields;
			const updatedPlayers = players.map((player) => {
				if (player.name === name) {
					return currentPlayer;
				}
				return player;
			});
			return {
				players: updatedPlayers,
			}
		});
	};

	render() {
		return (
			<div style={Styles.grid}>
				{this.state.players.map((player, idx) => {
					return (
						<div key={`${player.name}-${idx}`} style={Styles.row}>
							<span style={Styles.label}>{player.name}</span>
							<PlayerStatForm player={player} onChange={this.handleFormChange} />
						</div>
					)
				})}
			</div>
		);
	}
}

export default AdminEntryForm;
