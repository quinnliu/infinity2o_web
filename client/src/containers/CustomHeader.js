import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as colorThemeActions from '../actions/colorTheme';

import { Layout, Row, Col, Button, Icon } from 'antd';
const { Header } = Layout;

class CustomHeader extends Component {
	renderHeaderButtons() {
		const { colorTheme, onPressRandomColorTheme } = this.props;
		const loginState = this.props.auth.userInfo;
		switch (loginState) {
			case null:
				// show nothing when still signing in
				return;
			case false:
				return (
					<div>
						<Row type="flex" justify="start">
							<Col key="0">
								<Button
									style={{
										borderColor: colorTheme.text7Color,
										background: colorTheme.text7Color,
										color: colorTheme.text4Color
									}}
									onClick={onPressRandomColorTheme}
								>
									Change Theme
								</Button>
							</Col>
						</Row>
					</div>
				);
			default:
				return (
					<div>
						<Row type="flex" justify="space-between">
							<Col md={{ span: 5 }} key="0">
								<Button
									style={{
										borderColor: colorTheme.text7Color,
										background: colorTheme.text7Color,
										color: colorTheme.text4Color
									}}
									onClick={onPressRandomColorTheme}
								>
									Change Theme
								</Button>
							</Col>
							<Col md={{ span: 3, offset: 1 }} key="1">
								<Button
									style={{
										borderColor: colorTheme.key,
										background: colorTheme.key,
										color: colorTheme.text1Color
									}}
								>
									<Link to="/profile">
										<div>Profile</div>
									</Link>
								</Button>
							</Col>
							<Col md={{ span: 3, offset: 1 }} key="2">
								<Button
									style={{
										borderColor: colorTheme.text7Color,
										background: colorTheme.text7Color,
										color: colorTheme.text4Color
									}}
								>
									<Link to="/train_ai">
										<div>Train AI</div>
									</Link>
								</Button>
							</Col>
							<Col md={{ span: 3, offset: 1 }} key="3">
								<Button
									style={{
										borderColor: colorTheme.text7Color,
										background: colorTheme.text7Color,
										color: colorTheme.text4Color
									}}
								>
									<Link to="/matches">
										<div>Matches</div>
									</Link>
								</Button>
							</Col>
							<Col md={{ span: 3, offset: 4 }} key="4">
								<Button
									style={{
										borderColor: colorTheme.text7Color,
										background: colorTheme.text7Color,
										color: colorTheme.text4Color
									}}
								>
									<a href="/api/logout">Logout</a>
								</Button>
							</Col>
						</Row>
					</div>
				);
		}
	}

	render() {
		const { colorTheme } = this.props;
		return (
			<Header
				style={{
					background: colorTheme.backgroundColor,
					position: 'fixed',
					width: '100%'
				}}
			>
				{this.renderHeaderButtons()}
			</Header>
		);
	}
}

/*
So we have a state and a UI(with props).
This function gives the UI the parts of the state it will need to display.
*/
function mapStateToProps(state) {
	return {
		auth: state.auth,
		colorTheme: state.colorTheme
	};
}

/*
So we have a state and a UI(with props).
This function gives the UI the functions it will need to be called.
*/
function mapDispatchToProps(dispatch) {
	const customHeaderDispatchers = bindActionCreators(
		colorThemeActions,
		dispatch
	);

	return {
		onPressRandomColorTheme: () => {
			customHeaderDispatchers.generateRandomColorTheme();
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(CustomHeader);
