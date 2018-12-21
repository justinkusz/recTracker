import expect from 'expect';

import reducer from '../../reducers/AuthReducer';
import * as types from '../../actions/types';

describe('auth reducer', () => {
    it('should return the initial state', () => {
        expect(reducer(undefined, {})).toEqual({
                authToken: null,
                user: null,
                error: null,
                loading: false
            });
    });

    it('should set loading to true when signup attempted', () => {
        expect(reducer(undefined, {type: types.SIGNUP_ATTEMPTED}))
            .toEqual({
                authToken: null,
                user: null,
                error: null,
                loading: true
            });
    });

    it('should set loading=false and update error when signup failed', () => {
        const state = reducer(undefined, {
            type: types.SIGNUP_FAILED,
            payload: 'error message'
        });
        expect(state.authToken).toBeFalsy();
        expect(state.loading).toBeFalsy();
        expect(state.user).toBeFalsy();
        expect(state.error).toBeTruthy();
    });

    it('should set loading=false and update authToken and user', () => {
        const authToken = 'someverylongsecretstring';
        const user = {
            _id: 'someverylongid',
            email: 'someaddress@test.com'
        };
        expect(reducer(undefined, {
            type: types.SIGNUP_SUCCESS,
            payload: {authToken, user}
        })).toEqual({
            authToken: authToken,
            user: user,
            error: null,
            loading: false
        });
    });
});