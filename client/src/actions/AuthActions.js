import * as types from './types';
import axios from 'axios';

const signupAttempted = (dispatch) => {
    dispatch({ type: types.SIGNUP_ATTEMPTED });
}

const signupSuccess = (dispatch, authToken, user) => {
    dispatch({
        type: types.SIGNUP_SUCCESS,
        payload: { user, authToken }
    });
};

const signupFailed = (dispatch, err) => {
    dispatch({
        type: types.SIGNUP_FAILED,
        payload: err
    });
}

const logoutAttempted = (dispatch) => {
    dispatch({type: types.LOGOUT_ATTEMPTED});
};

const logoutSuccess = (dispatch) => {
    dispatch({type: types.LOGOUT_SUCCESS});
};

const logoutFailed = (dispatch, err) => {
    dispatch({type: types.LOGOUT_FAILED, payload: err});
};

const loginAttempted = (dispatch) => {
    dispatch({type: types.LOGIN_ATTEMPTED});
}

const loginFailed = (dispatch, err) => {
    dispatch({ type: types.LOGIN_FAILED, payload: err });
};

const loginSuccess = (dispatch, authToken, user) => {
    dispatch({
        type: types.LOGIN_SUCCESS,
        payload: { user, authToken }
    });
}

export const openedAuthPage = () => {
    return { type: types.OPENED_AUTH_PAGE };
}

export const attemptLogin = ({email, password}) => {
    return (dispatch) => {
        loginAttempted(dispatch);

        return axios.post('/users/login', {email, password}).then((res) => {
            const authToken = res.headers['x-auth'];
            const user = res.data;

            loginSuccess(dispatch, authToken, user);
        }, (err) => {
            loginFailed(dispatch, err.response.data);
        });
    };
};

export const attemptLogout = (user, token) => {
    return (dispatch) => {
        logoutAttempted(dispatch);

        return axios.delete('/users/me/token', {data: {user, token}}).then((res) => {
            logoutSuccess(dispatch);
        }, (err) => {
            logoutFailed(dispatch, err.response.data);
        });
    };
};

export const attemptSignup = ({email, password}) => {
    return (dispatch) => {
        signupAttempted(dispatch);

        return axios.post('/users', {email, password}).then((res) => {
            const authToken = res.headers['x-auth'];
            const user = res.data;
    
            signupSuccess(dispatch, authToken, user);
        }, (err) => {
            signupFailed(dispatch, err.response.data);
        });
    }
};