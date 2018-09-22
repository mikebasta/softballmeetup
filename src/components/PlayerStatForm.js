import React from 'react';
import PropTypes from 'prop-types';
import './components.css';

class PlayerStatForm extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			field: '',
			value: '',
		}
	}

	handleChange = (e) => {
		this.props.onChange(e, this.props.player.name);
	};

	render() {
		const { player } = this.props;
		const playerName = player.name;
		const stats = Object.keys(player.fields);

		return (
			<div className="admin-player-row">
				<span className="form-item-label">{playerName}</span>
				{ stats.map((field) => {
					return (
						<input
							type="number"
							className="stat-cell"
							name={field}
							key={`${field}-${playerName}`}
							onChange={this.handleChange}
							value={this.props.player.fields[field]}
						/>
					);
				}) }
			</div>
		)
	}
}

PlayerStatForm.propTypes = {
	onChange: PropTypes.func,
	player: PropTypes.shape(),
};

export default PlayerStatForm;
