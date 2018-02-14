import { SAVE_PROFILE_START, SAVE_PROFILE_DONE } from '../actions/types';

let cloneObject = obj => {
	return JSON.parse(JSON.stringify(obj));
};

let initialState = {
	age: null,
	name: null,
	time_zone: null,
	availability: null,
	interests: null
};

export default function(state = initialState, action) {
	let newState = cloneObject(state);
	switch (action.type) {
		case SAVE_PROFILE_START:
			newState.userInfo = action.payload.data || false;
			return newState;
		case SAVE_PROFILE_DONE:
			newState.userInfo = action.payload.data || false;
			return newState;
		default:
			return state;
	}
}
