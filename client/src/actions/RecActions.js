import * as types from './types';
import axios from 'axios';

export const dismissAlert = () => {
    return ({type: types.DISMISS_ALERT});
};

export const addRec = (rec) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');

        dispatch({type: types.REC_ADD_ATTEMPTED});

        return axios.post('/recs', rec, {
            headers: {'x-auth': authToken}
        }).then((res) => {
            dispatch({
                type: types.REC_ADD_SUCCESS,
                payload: res.data.rec
            });
        }, (err) => {
            dispatch({
                type: types.REC_ADD_ERROR,
                payload: err.response.data
            });
        });
    };
};

export const deleteRec = (rec) => {
    return (dispatch) => {
        const id = rec._id;
        const authToken = localStorage.getItem('authToken');

        dispatch({
            type: types.REMOVE_REC_ATTEMPTED,
            payload: id
        });

        return axios.delete(`/recs/${id}`, {
            headers: {'x-auth': authToken}
        }).then((res) => {
            dispatch({
                type: types.REMOVE_REC_SUCCESS,
                payload: res.data.rec
            })
        }, (err) => {
            dispatch({
                type: types.REMOVE_REC_FAILED,
                payload: err.response.data
            });
        });
    };
};

export const updateRec = (rec) => {
    return (dispatch) => {
        const id = rec._id;
        const authToken = localStorage.getItem('authToken');
        
        return axios.patch(`/recs/${id}`, rec, {
            headers: {'x-auth': authToken}
        }).then((res) => {
            dispatch({type: types.REC_UPDATE_SUCCESS, payload: res.data.rec});
        }, (err) => {
            dispatch({type: types.REC_UPDATE_ERROR, payload: err.response.data});
        });
    };
};

export const getRecsByRecommender = (recommender) => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');

        dispatch({type: types.RECS_FETCH_STARTED});

        return axios.get(`/recs/by/${recommender}`, {
            headers: {'x-auth': authToken}
        }).then((res) => {
            dispatch({
                type: types.RECS_FETCHED,
                payload: res.data.recs
            });
        }, (err) => {
            dispatch({
                type: types.RECS_FETCH_ERROR,
                payload: err.response.data
            });
        });
    };
};

export const getRecs = () => {
    return (dispatch) => {
        const authToken = localStorage.getItem('authToken');

        dispatch({type: types.RECS_FETCH_STARTED});
        
        return axios.get('/recs', {headers: {'x-auth': authToken}})
            .then((res) => {
                dispatch({
                    type: types.RECS_FETCHED,
                    payload: res.data.recs
                });
            }, (err) => {
                dispatch({
                    type: types.RECS_FETCH_ERROR,
                    payload: err.response.data
                });
            });
    };
};

export const filterRecs = (filter) => {
    return {type: types.REC_FILTER_CHANGED, payload: filter}
}