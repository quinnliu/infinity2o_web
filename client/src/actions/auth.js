import axios from 'axios';
import {
	SAVE_FETCHED_USER_AUTH,
	SAVE_FETCHED_USER_PROFILE,
	UPDATE_TOTAL_USER_VOTES_ACROSS_ALL_SESSIONS,
	UPDATE_MATCHES_SEEN,
	UPDATE_OUR_SOCKET_ID,
	TOLD_DB_CLIENT_IS_ONLINE,
	TOLD_DB_CLIENT_IS_ONLINE_ERROR
} from './types';
import { updateWithSavedColorTheme } from './colorTheme';
import { store } from '../index';
import io from 'socket.io-client';
export const socket = io(process.env.REACT_APP_SOCKET_DOMAIN, {
	transports: ['websocket']
});

function saveUserProfile(response, dispatch) {
	dispatch({
		type: SAVE_FETCHED_USER_PROFILE,
		profile: response.data.profile
	});

	// separate dispatch that goes to matches reducer
	dispatch({
		type: UPDATE_TOTAL_USER_VOTES_ACROSS_ALL_SESSIONS,
		additionalVotes: response.data.profile.asks.totalUserVotes
	});

	// separate dispatch that goes to customHeader reducer
	let numberOfUnseenMatches = 0;
	for (let i = 0; i < response.data.matches.length; i++) {
		if (response.data.matches[i]['seen'] === false) {
			numberOfUnseenMatches += 1;
		}
	}
	dispatch({
		type: UPDATE_MATCHES_SEEN,
		numberOfUnseenMatches: numberOfUnseenMatches,
		basicMatchInfo: response.data.matches
	});
}

async function storeUserSocketIdInRedis(
	dispatch,
	mongoDBUserId,
	userConversations
) {
	console.log('socket.id inside auth = ', socket.id);
	console.log('socket inside auth = ', socket);
	const info = {
		mongoDBUserId: mongoDBUserId,
		socketId: socket.id,
		userConversations: userConversations
	};

	// puts user inside of redis and tells online contacts that user is online
	const clientIsOnlineResponse = await axios.post(
		'/api/conversations/user_online',
		info
	);

	console.log('finished clientIsOnlineResponse');

	// if (clientIsOnlineResponse.status === 200) {
	// 	// update user socket id
	// 	dispatch({
	// 		type: UPDATE_OUR_SOCKET_ID,
	// 		ourSocketId: socket.id
	// 	});
	// 	dispatch({
	// 		type: TOLD_DB_CLIENT_IS_ONLINE
	// 	});
	// } else {
	// 	store.dispatch({ type: TOLD_DB_CLIENT_IS_ONLINE_ERROR });
	// }
}

export const initializeApp = () => async dispatch => {
	const response = await axios.get('/api/current_user');

	dispatch({
		type: SAVE_FETCHED_USER_AUTH,
		auth: response.data.auth,
		mongoDBUserId: response.data._id
	});

	if (store.getState().auth.loggedInState === 'logged_in') {
		storeUserSocketIdInRedis(
			dispatch,
			response.data.auth.mongoDBUserId,
			response.data.conversations
		);

		saveUserProfile(response, dispatch);
		updateWithSavedColorTheme(dispatch, response.data.profile.colorTheme);
	}
};
