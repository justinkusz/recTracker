import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { attemptLogout } from '../../actions';

class Navbar extends React.Component {
  render() {
    return (
      <nav className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
        {this.renderLinks()}
      </nav>
    )
  }

  onLogoutClick = () => {
    const token = localStorage.getItem('authToken');
    const user = this.props.user;

    this.props.attemptLogout(user, token);
  }

  renderLinks = () => {
    if (this.props.authenticated) {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <button
              onClick={this.onLogoutClick}
              className="btn btn-link nav-link">
              Logout
            </button>
          </li>
        </ul>
      )
    } else {
      return (
        <ul className="navbar-nav ml-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/register">Register</Link>
          </li>
          <li className="nav-item">
            <Link className="nav-link" to="/login">Login</Link>
          </li>
        </ul>
      )
    }
  }
};

const mapStateToProps = (state) => {
  const { authenticated, user } = state.auth;

  return { authenticated, user };
}

export default connect(mapStateToProps, { attemptLogout })(Navbar);