import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import moxios from 'moxios';

import * as actions from '../../actions/';
import * as types from '../../actions/types'; 

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('openedAuthPage', () => {
    it('creates OPENED_AUTH_PAGE action', () => {
        const expectedAction = {
            type: types.OPENED_AUTH_PAGE
        };

        expect(actions.openedAuthPage()).toEqual(expectedAction);
    });
});

describe('attemptLogin', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('creates LOGIN_SUCCESS action if login succeeds', () => {
        const creds = {
            email: 'existinguser@test.com',
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
                response: {_id: user._id, email: user.email}
            });
        });

        const expectedActions = [
            {type: types.LOGIN_ATTEMPTED},
            {type: types.AUTHENTICATED, payload: user}
        ];

        const store = mockStore({});

        return store.dispatch(actions.attemptLogin(creds)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates LOGIN_FAILED action if login failed', () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 401
            });
        });

        const expectedActions = [
            {type: types.LOGIN_ATTEMPTED},
            {type: types.LOGIN_FAILED}
        ];

        const store = mockStore({});

        const creds = {
            email: 'notarealuser@test.com',
            password: 'somepassword'
        };

        return store.dispatch(actions.attemptLogin(creds)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

describe('attemptLogout', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('creates LOGOUT_SUCCESS action if logout succeeds', () => {
        const user = {
            _id: 'somelongid',
            email: 'existinguser@test.com'
        };

        const authToken = 'someverylongsecretstring';

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200
            });
        });

        const expectedActions = [
            {type: types.LOGOUT_ATTEMPTED},
            {type: types.LOGOUT_SUCCESS}
        ];

        const store = mockStore({});

        return store.dispatch(actions.attemptLogout(user, authToken)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates LOGOUT_FAILED if logout fails', () => {
        const user = {
            _id: 'somelongid',
            email: 'existinguser@test.com'
        };

        const authToken = 'someverylongsecretstring';

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 400
            });
        });

        const expectedActions = [
            {type: types.LOGOUT_ATTEMPTED},
            {type: types.LOGOUT_FAILED}
        ];

        const store = mockStore({});

        return store.dispatch(actions.attemptLogout(user, authToken)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

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
            { type: types.AUTHENTICATED, payload: user }
        ];

        const store = mockStore({});

        return store.dispatch(actions.attemptSignup(creds)).then(() => {
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
        };

        return store.dispatch(actions.attemptSignup(creds)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});