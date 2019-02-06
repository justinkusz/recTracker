import * as types from '../actions/types';

const INITIAL_STATE = {
    recs: [],
    filter: {
        query: '',
        type: undefined,
        consumed: false
    },
    error: null,
    loading: false,
    updatingRec: null,
    alert: null
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case types.RECS_FETCH_STARTED:
            return { ...state, loading: true}
        case types.RECS_FETCHED:
            return {
                ...state,
                recs: action.payload,
                filteredRecs: action.payload,
                loading: false
            };
        case types.RECS_FETCH_ERROR:
            return {
                ...state,
                error: action.payload,
                loading: false
            };
        case types.REC_ADD_ATTEMPTED:
            return {
                ...state,
                loading: true
            }
        case types.REC_ADD_SUCCESS:
            return {
                ...state,
                error: null,
                alert: {
                    type: 'success',
                    action: 'add_rec',
                    rec: action.payload,
                    message: `Added recommendation: ${action.payload.title}`
                }
            }
        case types.REC_ADD_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case types.REC_UPDATE_ERROR:
            return {
                ...state,
                error: action.payload
            }
        case types.REC_UPDATE_SUCCESS:
            return {
                ...state,
                recs: state.recs.map((rec) => {
                    if (rec._id !== action.payload._id) {
                        return rec;
                    }
                    return {
                        ...rec,
                        ...action.payload
                    }
                })
            }
        case types.REMOVE_REC_ATTEMPTED:
            return {
                ...state,
                updatingRec: action.payload
            }
        case types.REMOVE_REC_FAILED:
            return {
                ...state,
                updatingRec: null,
                error: action.payload
            }
        case types.REMOVE_REC_SUCCESS:
            return {
                ...state,
                updatingRec: null,
                error: null,
                alert: {
                    type: 'success',
                    action: 'remove_rec',
                    rec: action.payload,
                    message: `Removed recommendation: "${action.payload.title}"`
                },
                recs: state.recs.filter(rec => rec._id !== action.payload._id) 
            }
        case types.DISMISS_ALERT:
            return {
                ...state,
                alert: null
            }
        case types.REC_FILTER_CHANGED:
            return {
                ...state,
                filter: action.payload
            }
        default:
            return INITIAL_STATE;
    }
};