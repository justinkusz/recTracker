import { SIGNUP_ATTEMPTED, SIGNUP_SUCCESS, SIGNUP_FAILED } from './types';
import axios from 'axios';

const signupAttempted = (dispatch) => {
    dispatch({ type: SIGNUP_ATTEMPTED });
}

const signupSuccess = (dispatch, authToken, user) => {
    dispatch({
        type: SIGNUP_SUCCESS,
        payload: { user, authToken }
    });
};

const signupFailed = (dispatch, err) => {
    dispatch({
        type: SIGNUP_FAILED,
        payload: err
    });
}

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