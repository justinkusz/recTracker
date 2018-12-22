import * as types from '../actions/types';

const INITIAL_STATE = {
    authToken: null,
    user: null,
    error: null,
    loading: false
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.SIGNUP_ATTEMPTED:
            return { ...state, loading: true };
        case types.SIGNUP_FAILED:
            return { ...state, loading: false, error: action.payload };
        case types.SIGNUP_SUCCESS:
            return {
                ...state,
                loading: false,
                authToken: action.payload.authToken,
                user: action.payload.user
            };
        case types.LOGIN_ATTEMPTED:
            return { ...state, loading: true };
        case types.LOGIN_FAILED:
            return { ...state, loading: false, error: action.payload };
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                loading: false,
                authToken: action.payload.authToken,
                user: action.payload.user,
                error: null
            };
        case types.LOGOUT_ATTEMPTED:
            return { ...state, loading: true };
        case types.LOGOUT_FAILED:
            return { ...state, loading: false, error: action.payload };
        case types.LOGOUT_SUCCESS:
            return INITIAL_STATE;
        case types.OPENED_AUTH_PAGE:
            return INITIAL_STATE;
        default:
            return state;
    }
}