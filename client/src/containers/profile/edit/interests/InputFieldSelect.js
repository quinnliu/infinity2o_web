import _ from 'lodash';
import React, { Component } from 'react';
import * as profileActionCreators from '../../../../actions/profile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import optionFields from './optionFields';
import ErrorMessage from '../ErrorMessage';
import { Row, Col, Select } from 'antd';
const { Option } = Select;

class InputFieldSelect extends Component {
	renderOptions() {
		const { colorTheme } = this.props;

		return _.map(optionFields, option => {
			return (
				<Option
					style={{
						borderColor: colorTheme.text8Color,
						background: colorTheme.text8Color,
						color: colorTheme.text5Color
					}}
					value={option.value}
					key={option.value}
				>
					{option.name}
				</Option>
			);
		});
	}

	onChangeInterests = e => {
		this.props.onChangeInterests(e);
	};

	render() {
		const { colorTheme, label, width, profile } = this.props;
		return (
			<div>
				<Row type="flex" justify="start" align="middle">
					<Col
						sm={{ span: 5 }}
						md={{ span: 3 }}
						lg={{ span: 5 }}
						xl={{ span: 3 }}
					>
						<h3
							style={{
								color: colorTheme.text6Color
							}}
						>
							{label}
						</h3>
					</Col>
					<Col
						sm={{ span: 18, offset: 1 }}
						md={{ span: 18, offset: 1 }}
						lg={{ span: 18, offset: 1 }}
						xl={{ span: 20, offset: 1 }}
					>
						<Select
							mode="multiple"
							style={{
								width: width,
								borderColor: colorTheme.text8Color,
								background: colorTheme.text8Color
							}}
							value={profile.newInterests}
							onChange={this.onChangeInterests}
							placeholder="Select up to 5 interests!"
						>
							{this.renderOptions()}
						</Select>
					</Col>
				</Row>
				<ErrorMessage
					message="1 to 5 interests pretty please"
					hasError={profile.hasInterestsError}
				/>
			</div>
		);
	}
}

/*
So we have a state and a UI(with props).
This function gives the UI the parts of the state it will need to display.
*/
function mapStateToProps(state) {
	return {
		colorTheme: state.colorTheme,
		profile: state.profile
	};
}

function mapDispatchToProps(dispatch) {
	const profileDispatchers = bindActionCreators(
		profileActionCreators,
		dispatch
	);

	return {
		onChangeInterests: newInterests => {
			profileDispatchers.onChangeInterests(newInterests);
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(InputFieldSelect);
