import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import { Button } from 'antd';
import "react-table/react-table.css";
import { sortByNameLength } from "../utils/Utils";

class AdminStatsTable extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			data: props.data,
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		//console.log('did update', { prevProps, prevState, snapshot });
	}

	handleSubmitData = () => {
		// hit the submit button
		// send state.data to server to update
	};

	renderEditable = (cellInfo) => {
		const isStatColumn = cellInfo.column.Header !== 'PLAYER';
		return (
			<div
				contentEditable={isStatColumn}
				suppressContentEditableWarning={isStatColumn}
				onKeyUp={e => {
					const value = Number(e.target.innerHTML);
					const data = [...this.state.data];

					if (isNaN(value) && isStatColumn) {
						e.preventDefault();
						data[cellInfo.index][cellInfo.column.id] = '';
					} else {
						data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
					}

					this.setState(() => ({ data }));
				}}
				dangerouslySetInnerHTML={{
					__html: this.state.data[cellInfo.index][cellInfo.column.id]
				}}
				className="stat-cell"
			/>
		);
	};

	render() {
		const { data } = this.state;
		return (
			<div>
				<ReactTable
					data={data}
					columns={[
						{
							Header: "PLAYER",
							accessor: "player",
							Cell: this.renderEditable,
							sortMethod: sortByNameLength,
							maxWidth: 150,
							width: 150,
						},
						{
							Header: "O",
							accessor: "o",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "1b",
							accessor: "1b",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "2b",
							accessor: "2b",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "3b",
							accessor: "3b",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "HR",
							accessor: "hr",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "RBI",
							accessor: "rbi",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "R",
							accessor: "r",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "BB",
							accessor: "bb",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "K",
							accessor: "k",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "SB",
							accessor: "sb",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "CS",
							accessor: "cs",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
						{
							Header: "AB",
							accessor: "ab",
							Cell: this.renderEditable,
							maxWidth: 50,
						},
					]}
					defaultPageSize={data.length}
					className="-striped -highlight stat-table"
					showPaginationBottom={false}
				/>
				<div className="submit-button">
					<Button
						type="primary"
						htmlType="button"
						onChange={this.handleSubmitData}
					>
						Submit
					</Button>
				</div>
			</div>
		);
	}
}

AdminStatsTable.propTypes = {
	data: PropTypes.array,
	onSubmit: PropTypes.func,
};

AdminStatsTable.defaultProps = {
	data: [],
};

export default AdminStatsTable;
