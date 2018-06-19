import axios from 'axios';
import {
	ON_CHANGE_CURRENT_MESSAGE,
	DISPLAY_SENT_MESSAGE,
	MESSAGE_SENT_SUCCESS,
	MESSAGE_SENT_ERROR
	//DISPLAY_RECEIVED_MESSAGE
} from '../types';
//import { store } from '../../index';
import { SOCKET } from '../auth';

export const onChangeCurrentMessage = newMessage => dispatch => {
	dispatch({
		type: ON_CHANGE_CURRENT_MESSAGE,
		newMessage: newMessage
	});
};

export const sendMessageToServer = (
	conversationId,
	selectedContactOnline,
	selectedContactSocketId,
	name,
	currentMessage
) => async dispatch => {
	dispatch({
		type: DISPLAY_SENT_MESSAGE,
		senderName: name
	});

	const timeCreated = Date.now();
	if (selectedContactOnline) {
		// use websockets for live chat
		SOCKET.emit('TELL_SERVER:MESSAGE_TO_CLIENT_B_FROM_CLIENT_A', {
			selectedContactSocketId: selectedContactSocketId,
			senderName: name,
			message: currentMessage,
			timeCreated: timeCreated
		});
		// console.log(
		// 	'TELL_SERVER:MESSAGE_TO_CLIENT_B_FROM_CLIENT_A currentMessage = ',
		// 	currentMessage
		// );
	}
	// save sent message into database
	const messageInfo = {
		conversationId: conversationId,
		senderName: name,
		message: currentMessage,
		timeCreated: timeCreated
	};
	const response = await axios.post('/api/conversations/chat', messageInfo);
	if (response.status === 200) {
		dispatch({
			type: MESSAGE_SENT_SUCCESS
		});
	} else {
		dispatch({ type: MESSAGE_SENT_ERROR });
	}
};

// if (SOCKET !== null) {
// 	SOCKET.on('TELL_CLIENT_B:MESSAGE_FROM_CLIENT_A', function(messageInfo) {
// 		// No need to save message into DB since the message was already
// 		// saved by client A. We just need to display the message to us(Client B)
// 		// console.log(
// 		// 	'TELL_CLIENT_B:MESSAGE_FROM_CLIENT_A messageInfo = ',
// 		// 	messageInfo
// 		// );
// 		store.dispatch({
// 			type: DISPLAY_RECEIVED_MESSAGE,
// 			messageInfo: messageInfo
// 		});
// 	});
// }
