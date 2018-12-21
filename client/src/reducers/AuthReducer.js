import { SIGNUP_ATTEMPTED, SIGNUP_SUCCESS, SIGNUP_FAILED } from '../actions/types';

const INITIAL_STATE = {
    authToken: null,
    user: null,
    error: null,
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGNUP_ATTEMPTED:
            return { ...state, loading: true }
        case SIGNUP_FAILED:
            return { ...state, loading: false, error: action.payload }
        case SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                authToken: action.payload.authToken,
                user: action.payload.user
            }
        default:
            return state;
    }
}