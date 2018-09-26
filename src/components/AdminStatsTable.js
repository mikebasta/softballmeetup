import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from "react-table";
import { Button } from 'antd';
import "react-table/react-table.css";
import { Keys, Utils } from "../utils";

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
		this.props.onSubmit(this.state.data);
	};

	makeContentEditable = (cellInfo) => {
		return !isNaN(cellInfo.value);
	};

	handleOnEnter = (e) => {
		const tabKey = e.charCode === Keys.TAB;
		const enterKey = e.charCode === Keys.ENTER;
		const charKeys = isNaN(String.fromCharCode(e.charCode));
		if (tabKey) {
			return true;
		}
		if (enterKey || charKeys) {
			e.preventDefault();
			return false;
		}
		return true;
	};

	handleDataEntry = (cellInfo) => (e) => {
		if (this.handleOnEnter(e)) {
			const value = Number(e.target.innerHTML);
			const data = [...this.state.data];
			data[cellInfo.index][cellInfo.column.id] = value;

			this.setState(() => ({ data }));
		}
	};

	renderEditable = (cellInfo) => {
		const makeContentEditable = this.makeContentEditable(cellInfo);

		return (
			<div
				className="stat-cell"
				contentEditable={makeContentEditable}
				suppressContentEditableWarning
				onKeyPress={this.handleOnEnter}
				onKeyUp={this.handleDataEntry(cellInfo)}
			>
				{this.state.data[cellInfo.index][cellInfo.column.id]}
			</div>
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
							sortMethod: Utils.sortByNameLength,
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
						onClick={this.handleSubmitData}
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
