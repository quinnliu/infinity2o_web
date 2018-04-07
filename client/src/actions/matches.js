import axios from 'axios';
import {
	SAVE_FETCHED_DAILY_MATCHES,
	UPDATE_INITIAL_MATCH,
	ON_NEXT_MATCH,
	MOVE_TO_CONVERSATIONS,
	UPDATE_CONTACTS,
	UPDATE_CONTACTS_ERROR,
	DELETE_MATCH_IN_DB,
	DELETE_MATCH_IN_DB_ERROR
} from './types';

export const fetchUserMatches = async (dispatch, mongoDBUserIds) => {
	const response = await axios.get(
		'/api/matches?mongoDBUserIds=' + mongoDBUserIds
	);
	dispatch({
		type: SAVE_FETCHED_DAILY_MATCHES,
		dailyMatches: response.data
	});
	dispatch({
		type: UPDATE_INITIAL_MATCH
	});
};

export const onNextMatch = () => dispatch => {
	dispatch({
		type: ON_NEXT_MATCH
	});
};

export const onStartConversation = (
	history,
	matchName,
	matchId
) => async dispatch => {
	const matchInfo = {
		matchId: matchId,
		matchName: matchName
	};
	// 1) need to remove match from current user
	// 2) need to remove current user from match's matches
	const response1 = await axios.delete('/api/matches/delete_match', {
		data: { matchId: matchId }
	});
	if (response1.status === 200) {
		dispatch({
			type: DELETE_MATCH_IN_DB
		});

		// 3) update current user's conversations with new conversation
		// 4) update match's conversations with new conversation
		const response2 = await axios.post(
			'/api/matches/start_conversation',
			matchInfo
		);
		if (response2.status === 200) {
			dispatch({
				type: MOVE_TO_CONVERSATIONS
			});
			console.log('matches response2.data = ', response2.data);
			dispatch({
				type: UPDATE_CONTACTS,
				allContacts: response2.data
			});
			history.push('/conversations');
		} else {
			dispatch({ type: UPDATE_CONTACTS_ERROR });
		}
	} else {
		dispatch({ type: DELETE_MATCH_IN_DB_ERROR });
	}
};