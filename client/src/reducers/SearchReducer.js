import * as types from "../actions/types";

const INITIAL_STATE = {
  results: undefined,
  error: undefined
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case types.MOVIE_QUERY_RESULTS:
      return {
        ...state,
        results: action.payload
      };
    case types.MOVIE_QUERY_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case types.TV_QUERY_RESULTS:
      return {
        ...state,
        results: action.payload
      };
    case types.TV_QUERY_ERROR:
      return {
        ...state,
        error: action.payload
      }
    case types.ALBUM_QUERY_RESULTS:
      return {
        ...state,
        results: action.payload
      };
    case types.ALBUM_QUERY_ERROR:
      return {
        ...state,
        error: action.payload
      };
    case types.CLEAR_QUERY:
      return INITIAL_STATE;
    default:
      return INITIAL_STATE;
  }
};
