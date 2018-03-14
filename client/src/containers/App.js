import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { connect } from 'react-redux';
import * as indexActionCreators from '../actions/index';
import { bindActionCreators } from 'redux';

import CustomHeader from './CustomHeader';
import Landing from './Landing';
import Profile from './profile/Profile';
import ProfileEdit from './profile/edit/ProfileEdit';
import TrainAI from './train_ai/TrainAI';
import Ask from './train_ai/Ask';
import Matches from './matches/Matches';

import { Layout, Row, Col } from 'antd';

const { Footer } = Layout;

class App extends Component {
	componentWillMount() {
		// run once before first render()
		this.props.initializeApp();
	}

	render() {
		//console.log('this.props inside App', this.props);
		return (
			<BrowserRouter>
				<Layout style={styles.layout}>
					<CustomHeader />
					<Route exact={true} path="/" component={Landing} />
					<Route exact={true} path="/profile" component={Profile} />
					<Route
						exact={true}
						path="/profile/edit"
						component={ProfileEdit}
					/>
					<Route exact={true} path="/train_ai" component={TrainAI} />
					<Route exact={true} path="/train_ai/ask" component={Ask} />
					<Route exact={true} path="/matches" component={Matches} />
					<Footer
						style={{
							textAlign: 'center',
							background: this.props.colorTheme.backgroundColor,
							color: this.props.colorTheme.text7Color
						}}
					>
						<Row>
							<Col span={24}>
								<p>Infinity2o Inc. © 2018 -> ∞</p>
							</Col>
						</Row>
						<Row type="flex" justify="center">
							<Col span={24}>
								<p>
									<a
										style={{
											color: this.props.colorTheme
												.keyText7Color
										}}
										href="https://medium.com/infinity2o"
									>
										blog
									</a>
								</p>
							</Col>
						</Row>
					</Footer>
				</Layout>
			</BrowserRouter>
		);
	}

	componentDidMount() {
		// run once after first render()
		//console.log('componentDidMount this.props = ', this.props);
	}
}

var styles = {
	layout: {
		height: '100vh'
	}
};

/*
So we have a state and a UI(with props).
This function gives the UI the parts of the state it will need to display.
*/
function mapStateToProps(state) {
	return {
		colorTheme: state.colorTheme,
		auth: state.auth,
		profile: state.profile,
		mongoDBUserId: state.auth.mongoDBUserId
	};
}

/*
So we have a state and a UI(with props).
This function gives the UI the functions it will need to be called.
*/
function mapDispatchToProps(dispatch) {
	const indexDispatchers = bindActionCreators(indexActionCreators, dispatch);

	return {
		initializeApp: () => {
			indexDispatchers.initializeApp();
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
