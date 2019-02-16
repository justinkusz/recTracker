import * as types from "./types";
import axios from "axios";

export const movieQuery = title => {
  return dispatch => {
    const key = process.env.TMDB_KEY;

    const api = "https://api.themoviedb.org/3/search/movie?";
    const url = `${api}api_key=${key}&query=${title}`;

    return axios.get(url).then(
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
    const key = process.env.DISCOGS_KEY;
    const secret = process.env.DISCOGS_SECRET;
    const api = "https://api.discogs.com/database/search?";

    const url = `${api}q=${title}&key=${key}&secret=${secret}`;

    return axios.get(url).then(
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
