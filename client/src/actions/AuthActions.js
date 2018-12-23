import * as types from './types';
import axios from 'axios';


export const openedAuthPage = () => {
    return { type: types.OPENED_AUTH_PAGE };
}

export const attemptLogin = ({email, password}) => {
    return (dispatch) => {
        dispatch({type: types.LOGIN_ATTEMPTED});

        return axios.post('/users/login', {email, password}).then((res) => {
            const authToken = res.headers['x-auth'];
            const user = res.data;

            localStorage.setItem('authToken', authToken);

            dispatch({type: types.AUTHENTICATED, payload: user})
        }, (err) => {
            dispatch({ type: types.LOGIN_FAILED, payload: err.response.data });
        });
    };
};

export const attemptLogout = (user, token) => {
    return (dispatch) => {
        dispatch({type: types.LOGOUT_ATTEMPTED});

        return axios.delete('/users/me/token', {
            data: {user, token},
            headers: {'x-auth': token}
            }).then((res) => {
            localStorage.removeItem('authToken');
            dispatch({type: types.LOGOUT_SUCCESS});
        }, (err) => {
            dispatch({type: types.LOGOUT_FAILED, payload: err.response.data});
        });
    };
};

export const attemptSignup = ({email, password}) => {
    return (dispatch) => {
        dispatch({ type: types.SIGNUP_ATTEMPTED });

        return axios.post('/users', {email, password}).then((res) => {
            const authToken = res.headers['x-auth'];
            const user = res.data;
            localStorage.setItem('authToken', authToken);

            dispatch({type: types.AUTHENTICATED, payload: user});
        }, (err) => {
            dispatch({type: types.SIGNUP_FAILED, payload: err.response.data});
        });
    }
};