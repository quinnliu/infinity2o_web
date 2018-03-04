import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as indexActionCreators from '../../actions/index';
import * as colorThemeActionCreators from '../../actions/colorTheme';
import { bindActionCreators } from 'redux';
import DisplayField from './DisplayField';
import { Layout, Row, Col, Button, Tabs } from 'antd';
const { Content } = Layout;
const { TabPane } = Tabs;

class Profile extends Component {
	componentWillMount() {
		// run once before first render()
		this.props.fetchUserProfile();
		this.props.onProfile();
	}
	callback(key) {
		console.log(key);
	}
	renderProfile(colorTheme, profile) {
		return (
			<div>
				<Row
					type="flex"
					justify="start"
					align="middle"
					style={{
						padding: '0% 0% 0%' // top left&right bottom
					}}
				>
					<Col md={{ span: 24 }}>
						<DisplayField label="Name: " value={profile.name} />
					</Col>
				</Row>
				<Row
					type="flex"
					justify="start"
					align="middle"
					style={{
						padding: '3% 0% 0%' // top left&right bottom
					}}
				>
					<Col md={{ span: 24 }}>
						<DisplayField label="Age: " value={profile.age} />
					</Col>
				</Row>
				<Row
					type="flex"
					justify="start"
					align="middle"
					style={{
						padding: '3% 0% 0%' // top left&right bottom
					}}
				>
					<Col md={{ span: 24 }}>
						<DisplayField
							label="Interest(s): "
							value={profile.interests}
						/>
					</Col>
				</Row>
				<Row
					type="flex"
					justify="start"
					align="middle"
					style={{
						padding: '3% 0% 0%' // top left&right bottom
					}}
				>
					<Col md={{ span: 24 }}>
						<DisplayField
							label="Time Zone: "
							value={profile.timeZone}
						/>
					</Col>
				</Row>
				<Row
					type="flex"
					justify="start"
					align="middle"
					style={{
						padding: '3% 0% 0%' // top left&right bottom
					}}
				>
					<Col md={{ span: 24 }}>
						<DisplayField
							label="Availability: "
							value={profile.availability}
						/>
					</Col>
				</Row>
				<Row
					type="flex"
					justify="start"
					style={{
						padding: '3% 0% 0%' // top left&right bottom
					}}
				>
					<Col span={24}>
						<Button
							style={{
								borderColor: colorTheme.key,
								background: colorTheme.key,
								color: colorTheme.text1Color
							}}
						>
							<a href="/profile/edit">Edit</a>
						</Button>
					</Col>
				</Row>
			</div>
		);
	}
	render() {
		//console.log('this.props in Profile.js', this.props);
		const { colorTheme, profile } = this.props;
		return (
			<Content
				style={{
					padding: '100px 50px 50px', // top left&right bottom
					background: colorTheme.backgroundColor
				}}
			>
				<Tabs
					style={{
						background: colorTheme.backgroundColor,
						color: colorTheme.text1Color
					}}
					defaultActiveKey="1"
					onChange={this.callback}
				>
					<TabPane
						style={{
							background: colorTheme.backgroundColor
						}}
						tab="Tab 1"
						key="1"
					>
						{this.renderProfile(colorTheme, profile)}
					</TabPane>
				</Tabs>
			</Content>
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

/*
So we have a state and a UI(with props).
This function gives the UI the functions it will need to be called.
*/
function mapDispatchToProps(dispatch) {
	const indexDispatchers = bindActionCreators(indexActionCreators, dispatch);
	const colorThemeDispatchers = bindActionCreators(
		colorThemeActionCreators,
		dispatch
	);
	return {
		fetchUserProfile: () => {
			indexDispatchers.fetchUserProfile();
		},
		onProfile: () => {
			colorThemeDispatchers.onProfile();
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
