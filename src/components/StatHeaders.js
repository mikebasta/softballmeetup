import React from 'react';
import PropTypes from 'prop-types';
import './components.css';

const StatHeaders = (props) => {
	const { stats } = props;
	return (
		<div className="stat-header-container">
			<span className="form-item-label">Stats</span>
			{ Object.keys(stats).map((stat, idx) => {
				return (
					<span key={`${stat}-${idx}`} className="stat-cell">
						{stat}
					</span>
				);
			})}
		</div>
	)
};

StatHeaders.propTypes = {
	stats: PropTypes.shape(),
};

export default StatHeaders;
