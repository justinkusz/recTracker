import expect from 'expect';

import reducer from '../../reducers/AuthReducer';
import * as types from '../../actions/types';

describe('auth reducer', () => {
    it('should return the initial state', () => {
        const initial = {
            authToken: null,
            user: null,
            error: null,
            loading: false
        };

        expect(reducer(undefined, {})).toEqual(initial);

        expect(reducer(undefined, {type: types.OPENED_AUTH_PAGE}))
            .toEqual(initial);
    });
    
    describe('signup', () => {
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

    describe('login', () => {
        it('should set loading=true when login attempted', () => {
            expect(reducer(undefined, {type: types.LOGIN_ATTEMPTED})).toEqual({
                authToken: null,
                user: null,
                error: null,
                loading: true
            });
        });
    
        it('should set loading=false and set error when login fails', () => {
            expect(reducer(undefined, {type: types.LOGIN_FAILED, payload: 'error'}))
                .toEqual({
                    authToken: null,
                    user: null,
                    error: 'error',
                    loading: false
                });
        });
    
        it('should set loading=false, error=null, and update user and authToken', () => {
            const authToken = 'someverylongsecretstring';
            const user = {
                _id: 'somelongid',
                email: 'existinguser@test.com'
            };
    
            expect(reducer(undefined, {
                type: types.LOGIN_SUCCESS,
                payload: {user, authToken}
            })).toEqual({
                authToken: authToken,
                user: user,
                error: null,
                loading: false
            });
        });
    });

    describe('logout', () => {
        it('should set loading=true when logout attempted', () => {
            expect(reducer(undefined, {type: types.LOGOUT_ATTEMPTED}))
                .toEqual({
                    authToken: null,
                    user: null,
                    error: null,
                    loading: true
                });
        });

        it('should set loading=false, update error when logout failed', () => {
            const authToken = 'someverylongsecretstring';
            const user = {
                _id: 'somelongid',
                email: 'existinguser@test.com'
            };

            const initial = reducer(undefined, {
                type: types.LOGIN_SUCCESS,
                payload: {user, authToken}
            });

            const updated = reducer(initial, {type: types.LOGOUT_FAILED, payload: 'error'});

            expect(updated).toEqual({
                authToken: authToken,
                user: user,
                loading: false,
                error: 'error'
            });
        });

        it('should return initial state when logout succeeds', () => {
            expect(reducer(undefined, {type: types.LOGOUT_SUCCESS}))
                .toEqual({
                    authToken: null,
                    user: null,
                    error: null,
                    loading: false
                });
        });
    });
});