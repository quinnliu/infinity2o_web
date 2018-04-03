import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as colorThemeActionCreators from '../../actions/colorTheme';
import * as contactsActionCreators from '../../actions/contacts';
import { bindActionCreators } from 'redux';
import { Layout, List, Spin, Button } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import './Contacts.css';
const { Content } = Layout;

class Contacts extends Component {
	componentWillMount() {
		// run once before first render()
	}

	handleInfiniteOnLoad = () => {
		const {
			contacts,
			setLoading,
			setHasMore,
			displayMoreContacts
		} = this.props;

		setLoading(true);
		if (contacts.displayedContacts.length === contacts.contacts.length) {
			setLoading(false);
			setHasMore(false);
			return;
		}
		displayMoreContacts(5);
		setLoading(false);
	};

	onSelectContact = id => {
		console.log('onSelectContact id = ', id);
	};

	render() {
		//console.log('Contacts this.props = ', this.props);
		const { colorTheme, contacts } = this.props;

		return (
			<Content
				style={{
					textAlign: 'center',
					padding: '0px 0px 0px', // top left&right bottom
					background: colorTheme.backgroundColor
				}}
			>
				<div className="demo-infinite-container">
					<InfiniteScroll
						initialLoad={false}
						loadMore={this.handleInfiniteOnLoad}
						hasMore={!contacts.loading && contacts.hasMore}
						useWindow={false}
					>
						<List
							dataSource={contacts.displayedContacts}
							renderItem={item => {
								//console.log('item = ', item);
								return (
									<List.Item
										style={{
											borderColor:
												colorTheme.backgroundColor,
											background:
												colorTheme.backgroundColor,
											padding: '5px 0px 0px'
										}}
									>
										<Button
											style={{
												borderColor:
													colorTheme.text8Color,
												background:
													colorTheme.text8Color,
												color: colorTheme.text4Color,
												height: '50px',
												width: '220px'
											}}
											onClick={e =>
												this.onSelectContact(
													item.conversationId
												)
											}
										>
											{item.matchName}
										</Button>
									</List.Item>
								);
							}}
						>
							{contacts.loading &&
								contacts.hasMore && (
									<Spin className="demo-loading" />
								)}
						</List>
					</InfiniteScroll>
				</div>
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
		contacts: state.contacts
	};
}

/*
So we have a state and a UI(with props).
This function gives the UI the functions it will need to be called.
*/
function mapDispatchToProps(dispatch) {
	const colorThemeDispatchers = bindActionCreators(
		colorThemeActionCreators,
		dispatch
	);

	const contactsDispatchers = bindActionCreators(
		contactsActionCreators,
		dispatch
	);

	return {
		onPressConversations: () => {
			colorThemeDispatchers.onPressConversations();
		},
		setLoading: loading => {
			contactsDispatchers.setLoading(loading);
		},
		setHasMore: hasMore => {
			contactsDispatchers.setHasMore(hasMore);
		},
		displayMoreContacts: numberOfContacts => {
			contactsDispatchers.displayMoreContacts(numberOfContacts);
		}
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);
