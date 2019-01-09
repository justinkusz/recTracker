import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import expect from 'expect';
import moxios from 'moxios';

import * as actions from '../../actions/';
import * as types from '../../actions/types'; 

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

describe('addRec', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('creates REC_ADD_ATTEMPTED and REC_ADD_SUCCESS actions', () => {
        const rec = {
            data: 'dummy data'
        };

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {rec}
            });
        });

        const expectedActions = [
            {type: types.REC_ADD_ATTEMPTED},
            {type: types.REC_ADD_SUCCESS, payload: rec}
        ];

        const store = mockStore({});

        return store.dispatch(actions.addRec(rec)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates REC_ADD_ATTEMPTED and REC_ADD_ERROR actions', () => {
        const rec = {
            data: 'dummy data'
        };

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 400,
                response: 'error'
            });
        });

        const expectedActions = [
            {type: types.REC_ADD_ATTEMPTED},
            {type: types.REC_ADD_ERROR, payload: 'error'}
        ];

        const store = mockStore({});

        return store.dispatch(actions.addRec(rec)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

describe('deleteRec', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('creates REMOVE_REC_ATTEMPTED and REMOVE_REC_SUCCESS actions', () => {
        const rec = {_id: 'somelongid'};

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {rec: rec}
            });
        });

        const expectedActions = [
            {type: types.REMOVE_REC_ATTEMPTED, payload: rec._id},
            {type: types.REMOVE_REC_SUCCESS, payload: rec}
        ];

        const store = mockStore({});

        return store.dispatch(actions.deleteRec(rec)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates REMOVE_REC_ATTEMPTED and REMOVE_REC_FAILED actions', () => {
        const rec = {_id: 'somelongid'};

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 400,
                response: 'error'
            });
        });

        const expectedActions = [
            {type: types.REMOVE_REC_ATTEMPTED, payload: rec._id},
            {type: types.REMOVE_REC_FAILED, payload: 'error'}
        ];

        const store = mockStore({});

        return store.dispatch(actions.deleteRec(rec)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

describe('updateRec', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('creates REC_UPDATE_SUCCESS action', () => {
        const rec = {_id: 'somelongstring'};

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {rec}
            });
        });

        const expectedAction = {
            type: types.REC_UPDATE_SUCCESS,
            payload: rec
        };

        const store = mockStore({});

        return store.dispatch(actions.updateRec(rec)).then(() => {
            expect(store.getActions()).toEqual([expectedAction]);
        });
    });

    it('creates REC_UPDATE_ERROR action', () => {
        const rec = {_id: 'somelongstring'};

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 404,
                response: 'error'
            });
        });

        const expectedAction = {
            type: types.REC_UPDATE_ERROR,
            payload: 'error'
        };

        const store = mockStore({});

        return store.dispatch(actions.updateRec(rec)).then(() => {
            expect(store.getActions()).toEqual([expectedAction]);
        });
    });
});

describe('getRecs', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('creates RECS_FETCH_STARTED and RECS_FETCHED actions', () => {
        const recs = [
            {data: 'rec1'},
            {data: 'rec2'}
        ];

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {recs: recs}
            });
        });

        const expectedActions = [
            {type: types.RECS_FETCH_STARTED},
            {type: types.RECS_FETCHED, payload: recs}
        ];

        const store = mockStore({});

        return store.dispatch(actions.getRecs()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates RECS_FETCH_STARTED and RECS_FETCH_ERROR actions', () => {
        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 400,
                response: 'error'
            });
        });

        const expectedActions = [
            {type: types.RECS_FETCH_STARTED},
            {type: types.RECS_FETCH_ERROR, payload: 'error'}
        ];

        const store = mockStore({});

        return store.dispatch(actions.getRecs()).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
});

describe('getRecsByRecommender', () => {
    beforeEach(() => {
        moxios.install();
    });

    afterEach(() => {
        moxios.uninstall();
    });

    it('creates RECS_FETCH_STARTED and RECS_FETCHED actions', () => {
        const recommender = 'somename';
        
        const recs = [
            {data: 'rec1'},
            {data: 'rec2'}
        ];

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 200,
                response: {recs}
            });
        });

        const expectedActions = [
            {type: types.RECS_FETCH_STARTED},
            {type: types.RECS_FETCHED, payload: recs}
        ];

        const store = mockStore({});

        return store.dispatch(actions.getRecsByRecommender(recommender)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });

    it('creates RECS_FETCH_STARTED and RECS_FETCH_ERROR actions', () => {
        const recommender = 'somename';

        moxios.wait(() => {
            const request = moxios.requests.mostRecent();
            request.respondWith({
                status: 400,
                response: 'error'
            });
        });

        const expectedActions = [
            {type: types.RECS_FETCH_STARTED},
            {type: types.RECS_FETCH_ERROR, payload: 'error'}
        ];

        const store = mockStore({});

        return store.dispatch(actions.getRecsByRecommender(recommender)).then(() => {
            expect(store.getActions()).toEqual(expectedActions);
        });
    });
})