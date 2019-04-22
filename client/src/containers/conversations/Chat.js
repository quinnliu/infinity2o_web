import React, { Component } from "react";
import { connect } from "react-redux";
import * as colorThemeActionCreators from "../../actions/colorTheme";
import * as chatActionCreators from "../../actions/conversations/chat";
import { bindActionCreators } from "redux";
import { Layout, Input, Row, Col, List } from "antd";
import "./Chat.css";

const { Content } = Layout;

class Chat extends Component {
	componentDidUpdate() {
		if (
			this.props.chat.currentMessage === null &&
			document.getElementById("lastMessage") !== null
		) {
			// when typing new message, no need to scroll back down
			document.getElementById("lastMessage").scrollIntoView();
		}
	}

	onChangeCurrentMessage = e => {
		// console.log('e.target.value = ', e.target.value);
		this.props.onChangeCurrentMessage(e.target.value);
	};

	onPressEnter = () => {
		//console.log('pressed enter');
		const { selectedConversationInfo, userId, chat } = this.props;

		if (chat.currentMessage.replace(/\s/g, "").length) {
			// string does not only contains whitespace
			this.props.sendMessageToServer(
				selectedConversationInfo.conversationId,
				selectedConversationInfo.selectedContactOnline,
				selectedConversationInfo.selectedContactSocketId,
				selectedConversationInfo.selectedContactMongoDBId,
				userId,
				chat.currentMessage
			);
		}
	};

	renderGreeting(noMessagesDiv) {
		const { selectedConversationInfo, userImageUrl } = this.props;

		const contactImageUrl =
			selectedConversationInfo.selectedContactMongoDBInfo.imageUrl;
		if (contactImageUrl && userImageUrl) {
			noMessagesDiv.innerHTML =
				`
            <div>
		        <img
                    class="profile-image"
		            src=` +
				contactImageUrl +
				`>
		        <img
                    class="profile-image user-image"
		            src=` +
				userImageUrl +
				`>
            </div>
            <div>
                <p
                    class="welcome-message">
                    Say hi to your new Match!
                </p>
            </div>`;
		}
	}

	renderLastMessageDiv(messageIndex, messagesLength) {
		// used to place div after last message
		if (messageIndex === messagesLength - 1) {
			return (
				<Col>
					<div id="lastMessage" />
				</Col>
			);
		}
	}

	render() {
		const { colorTheme, chat, windowHeight, userId } = this.props;
		const chatWindowHeight = windowHeight - 240;
		const chatWindowVerticalHeight = chatWindowHeight.toString() + "px";

		document.documentElement.style.setProperty(
			`--textDot5Color`,
			colorTheme.textDot5Color
		);
		document.documentElement.style.setProperty(
			`--text4Color`,
			colorTheme.text4Color
		);

		document.documentElement.style.setProperty(
			`--chat-window-vertical-height`,
			chatWindowVerticalHeight
		);

		const noMessagesDiv = document.querySelector(".ant-list-empty-text");
		if (noMessagesDiv !== null) {
			// no messages exist
			this.renderGreeting(noMessagesDiv);
		}

		return (
			<Content
				style={{
					textAlign: "center",
					background: colorTheme.textDot5Color,
					padding: "0px 0px 0px 0px"
				}}
			>
				<Row style={{ padding: "30px" }}>
					<Col>
						<List
							className="chat-list"
							dataSource={chat.last50Messages}
							renderItem={(messageInfo, messageIndex) => {
								const message = messageInfo.content;
								let justifyValue = "start";
								let messageBackgroundColor =
									colorTheme.keyText8Color;
								if (messageInfo.senderId === userId) {
									messageBackgroundColor =
										colorTheme.keyCompliment1Text8Color;
									justifyValue = "end";
								}

								let messageMarginBottom = "2px";
								if (
									messageIndex !==
										chat.last50Messages.length - 1 &&
									chat.last50Messages[messageIndex + 1]
										.senderId !== messageInfo.senderId
								) {
									// different person sending upcoming message so need to add additional padding
									messageMarginBottom = "30px";
								}
								return (
									<Row
										type="flex"
										justify={justifyValue}
										align="middle"
									>
										<Col>
											<List.Item
												style={{ padding: "0px 0px" }}
											>
												<p
													style={{
														background: messageBackgroundColor,
														color:
															colorTheme.text3Color,
														padding: "6px 12px 7px",
														fontFamily: "Overpass",
														fontSize: "14px",
														marginBottom: messageMarginBottom
													}}
												>
													{message}
												</p>
											</List.Item>
										</Col>
										{this.renderLastMessageDiv(
											messageIndex,
											chat.last50Messages.length
										)}
									</Row>
								);
							}}
						/>
					</Col>
				</Row>
				<Row type="flex" justify="start" align="middle">
					<Col xl={{ span: 24 }}>
						<Input
							className="chat-input"
							value={chat.currentMessage}
							placeholder="Type a message..."
							onChange={this.onChangeCurrentMessage}
							onPressEnter={this.onPressEnter}
							style={{
								borderColor: colorTheme.text8Color,
								background: colorTheme.textDot5Color,
								color: colorTheme.text8Color
							}}
						/>
					</Col>
				</Row>
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
		chat: state.chat,
		userId: state.auth.mongoDBUserId,
		selectedConversationInfo: state.contacts.selectedConversationInfo,
		windowHeight: state.customHeader.windowHeight,
		userImageUrl: state.profile.imageUrl
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

	const chatDispatchers = bindActionCreators(chatActionCreators, dispatch);
	return {
		onPressConversations: () => {
			colorThemeDispatchers.onPressConversations();
		},
		onChangeCurrentMessage: newMessage => {
			chatDispatchers.onChangeCurrentMessage(newMessage);
		},
		sendMessageToServer: (
			conversationId,
			selectedContactOnline,
			selectedContactSocketId,
			selectedContactMongoDBId,
			userId,
			currentMessage
		) => {
			chatDispatchers.sendMessageToServer(
				conversationId,
				selectedContactOnline,
				selectedContactSocketId,
				selectedContactMongoDBId,
				userId,
				currentMessage
			);
		}
	};
}

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(Chat);
