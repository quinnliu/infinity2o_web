import _ from 'lodash';
import React, { Component } from 'react';
import * as voteEditActionCreators from '../../../actions/profile/voteEdit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { Row, Col, Button, Icon } from 'antd';

class VoteEdit extends Component {
	componentWillMount() {
		// run once before first render()
	}

	onPressPage(displayPage) {
		this.props.onPressPage(displayPage);
	}

	renderFetchIcon(index) {
		const { voteEdit } = this.props;
		if (voteEdit.fetchState[index] === 'start') {
			return <Icon type="loading" />;
		} else if (voteEdit.fetchState[index] === 'done') {
			return <Icon type="check" />;
		} else if (voteEdit.fetchState[index] === 'error') {
			return <Icon type="warning" />;
		}
	}

	onPressAsk(mongoDBAskId, index) {
		this.props.onPressAsk(mongoDBAskId, index);
	}

	renderPagination() {
		const { colorTheme, profile, voteEdit } = this.props;

		let numberOfItems = 0;
		if (profile.asks != null) {
			numberOfItems = profile.asks.votes.length;
		}

		const numberOfButtons = Math.round(numberOfItems / 8);
		return _.map(new Array(numberOfButtons), (pageButton, index) => {
			let textColor = colorTheme.text5Color;
			const displayPage = index + 1;
			if (voteEdit.page === displayPage) {
				textColor = colorTheme.text1Color;
			}
			return (
				<Col
					key={index}
					style={{
						padding: '0px 3px'
					}}
				>
					<Button
						style={{
							borderColor: colorTheme.text8Color,
							background: colorTheme.text8Color,
							color: textColor
						}}
						onClick={e => this.onPressPage(displayPage)}
					>
						{displayPage}
					</Button>
				</Col>
			);
		});
	}

	renderVotes() {
		const { colorTheme, profile, voteEdit } = this.props;

		const PER_PAGE = 8;
		if (profile.asks != null) {
			let i = 0;
			let f = PER_PAGE;
			if (voteEdit.page !== 1) {
				i = (voteEdit.page - 1) * PER_PAGE;
				f = voteEdit.page * PER_PAGE;
			}

			const newest5Votes = profile.asks.votes.slice(i, f).reverse();
			return _.map(newest5Votes, (vote, index) => {
				return (
					<div key={index}>
						<Row type="flex" justify="start" align="middle">
							<Col
								style={{
									padding: '0px 0px 8px'
								}}
								sm={{ span: 5 }}
								md={{ span: 5 }}
								lg={{ span: 5 }}
								xl={{ span: 5 }}
							>
								<Button
									style={{
										borderColor: colorTheme.text8Color,
										background: colorTheme.text8Color,
										color: colorTheme.text3Color
									}}
									onClick={e =>
										this.onPressAsk(vote._askId, index)
									}
								>
									<p
										style={{
											padding: '4px 0px 0px',
											color: colorTheme.text3Color
										}}
									>
										{vote.question}{' '}
										{this.renderFetchIcon(index)}
									</p>
								</Button>
							</Col>
							<Col
								sm={{ span: 18, offset: 1 }}
								md={{ span: 18, offset: 1 }}
								lg={{ span: 18, offset: 1 }}
								xl={{ span: 18, offset: 1 }}
							>
								<h3
									style={{
										color: colorTheme.text3Color
									}}
								>
									{vote.selectedAnswer}
								</h3>
							</Col>
						</Row>
					</div>
				);
			});
		}
	}

	render() {
		//console.log('this.props inside VoteEdit', this.props);

		return (
			<div>
				{this.renderVotes()}
				<Row type="flex" justify="start" align="middle">
					{this.renderPagination()}
				</Row>
			</div>
		);
	}

	componentDidMount() {
		// run once after first render()
		//console.log('componentDidMount this.props = ', this.props);
	}
}

/*
So we have a state and a UI(with props).
This function gives the UI the parts of the state it will need to display.
*/
function mapStateToProps(state) {
	return {
		colorTheme: state.colorTheme,
		profile: state.profile,
		voteEdit: state.voteEdit
	};
}

/*
So we have a state and a UI(with props).
This function gives the UI the functions it will need to be called.
*/
function mapDispatchToProps(dispatch) {
	const voteEditDispatchers = bindActionCreators(
		voteEditActionCreators,
		dispatch
	);

	return {
		onPressPage: newPage => {
			voteEditDispatchers.onPressPage(newPage);
		},
		onPressAsk: (mongoDBAskId, index) => {
			voteEditDispatchers.onPressAsk(mongoDBAskId, index);
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(VoteEdit);
