import * as types from "../actions/types";

const INITIAL_STATE = {
  authenticated: false,
  error: null,
  loading: false,
  user: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SIGNUP_ATTEMPTED:
      return { ...state, loading: true };
    case types.SIGNUP_FAILED:
      return { ...state, loading: false, error: action.payload };
    case types.LOGIN_ATTEMPTED:
      return { ...state, loading: true };
    case types.LOGIN_FAILED:
      return { ...state, loading: false, error: action.payload };
    case types.AUTHENTICATED:
      return {
        ...state,
        loading: false,
        authenticated: true,
        error: null,
        user: action.payload
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
};
