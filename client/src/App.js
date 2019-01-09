import React, { Component } from 'react';
import Navbar from './components/layouts/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Recommendations from './components/recs/Recommendations';
import AddRec from './components/recs/AddRec';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import reduxThunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import combineReducers from './reducers';
import PrivateRoute from './components/common/PrivateRoute';
import { AUTHENTICATED } from './actions/types';

class App extends Component {
  render() {
    const store = createStore(combineReducers, {}, applyMiddleware(reduxThunk));

    const authToken = localStorage.getItem('authToken');

    if (authToken) {
      const { user } = store.getState().auth;
      store.dispatch({type: AUTHENTICATED, payload: user});
    }

    return (
      <Provider store={store}>
        <Router>
          <div>
          <Navbar />
          <div className="App-content" style={{paddingTop: 60}}>
              <Switch>
                <PrivateRoute exact path="/recs" component={Recommendations} />
                <PrivateRoute exact path="/add-rec" component={AddRec} />
              </Switch>
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
            </div>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;