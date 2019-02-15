import { combineReducers } from 'redux';

import AuthReducer from './AuthReducer';
import RecsReducer from './RecsReducer';
import SearchReducer from './SearchReducer';

export default combineReducers({
     auth: AuthReducer,
     recs: RecsReducer,
     search: SearchReducer
    });