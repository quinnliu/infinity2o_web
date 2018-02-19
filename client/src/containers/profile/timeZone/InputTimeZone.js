import React, { Component } from 'react';
import * as profileActionCreators from '../../../actions/profile';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { TreeSelect, Row, Col } from 'antd';
import timeZones from './timeZones';

class InputTimeZone extends Component {
	onChangeTimeZone = e => {
		//console.log('e onChangeTimeZone = ', e);
		this.props.onChangeTimeZone(e.target.value);
	};

	renderValue(profile) {
		if (profile.newTimeZone === undefined) {
			return profile.time_zone;
		} else {
			return profile.newTimeZone;
		}
	}
	render() {
		//console.log('InputTimeZone this.props = ', this.props);
		// <input onBlur={input.onBlur} onChange={input.onChange} />
		const { colorTheme, label, width, profile } = this.props;
		return (
			<div>
				<Row type="flex" justify="start" align="middle">
					<Col
						sm={{ span: 5 }}
						md={{ span: 5 }}
						lg={{ span: 5 }}
						xl={{ span: 5 }}
					>
						<h3
							style={{
								color: colorTheme.keyText5Color
							}}
						>
							{label}
						</h3>
					</Col>
					<Col
						sm={{ span: 18, offset: 1 }}
						md={{ span: 18, offset: 1 }}
						lg={{ span: 18, offset: 1 }}
						xl={{ span: 18, offset: 1 }}
					>
						<TreeSelect
							style={{ width }}
							dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
							value={this.renderValue(profile)}
							onChange={this.onChangeTimeZone}
							treeData={timeZones}
							placeholder="Time Zone?"
						/>
					</Col>
				</Row>
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
		saveProfile: values => {
			profileDispatchers.saveProfile(values);
		},
		onChangeTimeZone: newTimeZone => {
			profileDispatchers.onChangeTimeZone(newTimeZone);
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(InputTimeZone);
