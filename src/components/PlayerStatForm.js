import React from 'react';
import { Form, Input } from 'antd';
import StyleSheet from './Styles';
import 'antd/dist/antd.css';
import './components.css';

const FormItem = Form.Item;
const categories = ['ab', '1b', '2b', '3b', 'hr', 'rbi', 'r', 'bb', 'k'];

const PlayerStatForm = Form.create({
	onFieldsChange(props, changedFields) {
		const updatedFields = { ...props.player.fields, ...changedFields };
		console.log('onFieldsChange', { name: props.player.name, updatedFields, changedFields });
		props.onChange(updatedFields, props.player.name);
	},
	mapPropsToFields(props) {
		// #1 called on mount
		console.log('mapPropsToFields', props);
		return {
			name: Form.createFormField({
				name: props.player.name
			}),
			fields: {
				ab: Form.createFormField({
					...props.player.fields.ab,
					value: props.player.fields.ab.value,
				}),
				"1b": Form.createFormField({
					...props.player.fields["1b"],
					value: props.player.fields["1b"].value,
				}),
				"2b": Form.createFormField({
					...props.player.fields["2b"],
					value: props.player.fields["2b"].value,
				}),
				"3b": Form.createFormField({
					...props.player.fields["3b"],
					value: props.player.fields["3b"].value,
				}),
				hr: Form.createFormField({
					...props.player.fields.hr,
					value: props.player.fields.hr.value,
				}),
				rbi: Form.createFormField({
					...props.player.fields.rbi,
					value: props.player.fields.rbi.value,
				}),
				r: Form.createFormField({
					...props.player.fields.r,
					value: props.player.fields.r.value,
				}),
				bb: Form.createFormField({
					...props.player.fields.bb,
					value: props.player.fields.bb.value,
				}),
				k: Form.createFormField({
					...props.player.fields.k,
					value: props.player.fields.k.value,
				}),
			},
		}
	},
	onValuesChange(_, values) {
		console.log('onValuesChange', values);
	},
})((props) => {
	const { getFieldDecorator } = props.form;
	return (
		<Form layout="inline" style={StyleSheet.form}>
			{categories.map((category) => (
				<FormItem key={category} className="form-item" label={category} style={StyleSheet.formItem}>
					{getFieldDecorator(category, {
						rules: [{ required: false, message: '' }],
					})(<Input type="number" style={StyleSheet.input} />)}
				</FormItem>
			))}
		</Form>
	);
});

export default PlayerStatForm;
