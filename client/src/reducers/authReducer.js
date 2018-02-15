import { FETCH_USER } from '../actions/types';

let cloneObject = obj => {
	return JSON.parse(JSON.stringify(obj));
};

let initialState = {
	user: {
		_id: null,
		googleId: null,
		__v: null,
		linkedInId: null,
		location: null,
		profile: {
			age: null,
			name: null,
			time_zone: null,
			availability: null,
			interests: null
		}
	}
};

export default function(state = initialState, action) {
	let newState = cloneObject(state);
	switch (action.type) {
		case FETCH_USER:
			newState.user = action.payload.data || false;
			return newState;
		default:
			return state;
	}
}
