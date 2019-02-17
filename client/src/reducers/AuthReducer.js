import * as types from "../actions/types";

const INITIAL_STATE = {
  authenticated: false,
  loginError: null,
  registerError: null,
  loading: false,
  user: null
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.SIGNUP_ATTEMPTED:
      return { ...state, loading: true, registerError: null };
    case types.SIGNUP_FAILED:
      return { ...state, loading: false, registerError: action.payload };
    case types.LOGIN_ATTEMPTED:
      return { ...state, loading: true, loginError: null };
    case types.LOGIN_FAILED:
      return { ...state, loading: false, loginError: action.payload };
    case types.AUTHENTICATED:
      return {
        ...state,
        loading: false,
        authenticated: true,
        loginError: null,
        registerError: null,
        user: action.payload
      };
    case types.LOGOUT_ATTEMPTED:
      return { ...state, loading: true };
    case types.LOGOUT_FAILED:
      return { ...state, loading: false, error: action.payload };
    case types.LOGOUT_SUCCESS:
      return INITIAL_STATE;
    default:
      return state;
  }
};
