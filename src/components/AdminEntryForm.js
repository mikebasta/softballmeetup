import React from 'react';
import PropTypes from 'prop-types';
import StatHeaders from './StatHeaders';
import PlayerStatForm from './PlayerStatForm';
import './components.css';

class AdminEntryForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			players: this.setPlayerFields(props),
		};
	}

	/**
	 * set up state => [{ player1: { fields: {} } }, { player2: { fields: {} } }]
	 * @param {Array} players: list of players attended
	 * @param {Object} fields: object of all stats to track
	 * @return [Array] list of players mapped with fields data
	 */
	setPlayerFields = ({ fields, players }) => players.map(player => ({ name: player, fields }));

	handleFormChange = (e, playerName) => {
		const { players } = this.state;
		const value = e.target.value;
		const field = e.target.name;
		const currentPlayer = players.find((player) => player.name === playerName);
		currentPlayer.fields[field] = value;

		const updatedPlayers = this.state.players.map(playa => {
			if (playa.name === currentPlayer.name) {
				return currentPlayer;
			}
			return playa;
		});

		this.setState(() => ({ players: updatedPlayers }));
		//	this.props.onChange(this.state.players);

	};

	render() {
		const { players } = this.state;

		return (
			<form className="admin-form">
				<StatHeaders stats={this.props.fields} />
				<div className="admin-form-container">
					{ players.map((player, idx) => (
						<PlayerStatForm
							key={`${player.name}-${idx}`}
							player={player}
							onChange={this.handleFormChange}
						/>
					)) }
				</div>
			</form>
		);
	}
}

AdminEntryForm.propTypes = {
	fields: PropTypes.shape(),
	players: PropTypes.array,
};

export default AdminEntryForm;
