import React, { Component } from 'react';
import './App.css';
import Navbar from './components/layouts/Navbar';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Recommendations from './components/recs/Recommendations';
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
          <div className="App">
            <Navbar />
            <div className="container">
              <Switch>
                <PrivateRoute exact path="/" component={Recommendations} />
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