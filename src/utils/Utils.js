import React from "react";
//import "./index.css";

const players = [
	'Vien',
	'Mike',
	'Steven',
	'Cory',
	'John',
	'Jason',
	'Wynn',
	'Al',
	'Carlos',
	'Cameron',
	'Efrain',
	'Kevin H',
	'Kevin A',
	'Dale',
	'James',
	'Brendan',
	'Eli',
	'Hector',
];

// returns an array of len numbers, starting from 0
const range = len => {
	const arr = [];
	for (let i = 0; i < len; i++) {
		arr.push(i);
	}
	return arr;
};

const newPerson = (player) => {
	return {
		player,
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
	};
};

export function makeData() {
	return players.map((p) => {
		return {
			...newPerson(p),
			//children: range(10).map(newPerson)
		};
	});
}

export function sortByNameLength(a, b) {
	if (a.length === b.length) {
		return a > b ? 1 : -1;
	}
	return a.length > b.length ? 1 : -1;
}
//
//export const Logo = () =>
//	<div style={{ margin: '1rem auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center'}}>
//		For more examples, visit {''}
//		<br />
//		<a href="https://github.com/react-tools/react-table" target="_blank">
//			<img
//				src="https://github.com/react-tools/media/raw/master/logo-react-table.png"
//				style={{ width: `150px`, margin: ".5em auto .3em" }}
//			/>
//		</a>
//	</div>;
//
//export const Tips = () =>
//	<div style={{ textAlign: "center" }}>
//		<em>Tip: Hold shift when sorting to multi-sort!</em>
//	</div>;
