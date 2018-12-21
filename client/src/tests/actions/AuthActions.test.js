import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import moxios from 'moxios';

import { attemptSignup } from '../../actions/';
import * as types from '../../actions/types'; 

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('attemptSignup', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('creates SIGNUP_SUCCESS action if signup succeeds', () => {
        const creds = {
            email: 'someexistinguser@test.com',
            password: 'somepassword'
        };

        const authToken = 'someverylongsecretstring';

        const user = {
            _id: 'somelongid',
            email: creds.email
        };

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                headers: {'x-auth': authToken},
                response: {_id: user._id, email: creds.email}
            });
        });

        const expectedActions = [
            { type: types.SIGNUP_ATTEMPTED },
            { type: types.SIGNUP_SUCCESS, payload: {user, authToken} }
        ];

        const store = mockStore({});
        

        return store.dispatch(attemptSignup(creds)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates SIGNUP_FAILED action if signup fails', () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 400
            });
        });

        const expectedActions = [
            { type: types.SIGNUP_ATTEMPTED },
            { type: types.SIGNUP_FAILED }
        ];

        const store = mockStore({});
        const creds = {
            email: 'notarealuser@test.com',
            password: 'somedummypassword'
        }

        return store.dispatch(attemptSignup(creds)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});