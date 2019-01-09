import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import RecsReducer from './RecsReducer';

export default combineReducers({
     auth: AuthReducer,
     recs: RecsReducer
    });