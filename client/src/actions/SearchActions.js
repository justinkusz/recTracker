import * as types from "./types";
import axios from "axios";

export const movieQuery = title => {
  return dispatch => {
    return axios.get(`/movie/${title}`).then(
      res => {
        dispatch({
          type: types.MOVIE_QUERY_RESULTS,
          payload: res.data.results
        });
      },
      err => {
        dispatch({
          type: types.MOVIE_QUERY_ERROR,
          payload: err.response.data
        });
      }
    );
  };
};

export const albumQuery = title => {
  return dispatch => {
    return axios.get(`/album/${title}`).then(
      res => {
        dispatch({
          type: types.ALBUM_QUERY_RESULTS,
          payload: res.data.results
        });
      },
      err => {
        dispatch({
          type: types.ALBUM_QUERY_ERROR,
          payload: err.response.data
        });
      }
    );
  };
};

export const clearSearch = () => {
  return {
    type: types.CLEAR_QUERY
  };
};
