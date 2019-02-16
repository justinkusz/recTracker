import * as types from './types';
import axios from 'axios';

export const movieQuery = (title) => {
    return (dispatch) => {
        var key;
        if (process.env.NODE_ENV === "production") {
            key = process.env.TMDB_KEY;
        } else {
            key = require('./apiKeys.json').tmdb.key;
        }

        const api = 'https://api.themoviedb.org/3/search/movie?';
        const url = `${api}api_key=${key}&query=${title}`;

        return axios.get(url).then((res) => {
            dispatch({
                type: types.MOVIE_QUERY_RESULTS,
                payload: res.data.results
            });
        }, (err) => {
            dispatch({
                type: types.MOVIE_QUERY_ERROR,
                payload: err.response.data
            });
        });

    };
};

export const albumQuery = (title) => {
    return (dispatch) => {
        var key;
        var secret;
        if (process.env.NODE_ENV === "production") {
            key = process.env.DISCOGS_KEY;
            secret = process.env.DISCOGS_SECRET;
        } else {
            const creds = require('./apiKeys.json').discogs;
            key = creds.key;
            secret = creds.secret;
        }
        const api = 'https://api.discogs.com/database/search?';

        const url = `${api}q=${title}&key=${key}&secret=${secret}`;

        return axios.get(url).then((res) => {
            dispatch({
                type: types.ALBUM_QUERY_RESULTS,
                payload: res.data.results
            });
        }, (err) => {
            dispatch({
                type: types.ALBUM_QUERY_ERROR,
                payload: err.response.data
            });
        });
    };
};

export const clearSearch = () => {
    return {
        type: types.CLEAR_QUERY
    }
}