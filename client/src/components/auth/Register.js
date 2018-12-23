import React, { Component } from 'react';
import { connect } from 'react-redux';

import { attemptSignup, openedAuthPage } from '../../actions';

class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirm: ''
    }
  }

  componentDidMount() {
    if(this.props.authenticated) {
      this.props.history.push('/');
    } else {
      this.props.openedAuthPage();
    }
  }

  onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmit = (event) => {
    event.preventDefault();

    const user = {
      email: this.state.email,
      password: this.state.password
    }

    this.props.attemptSignup(user);
  }

  validate = (email, password, confirm) => {
    return {
      email: email.length < 8,
      password: password.length < 8,
      confirm: password !== confirm
    };
  }

  errorMessage = (error) => {
    if (!error) {
      return null;
    }
    return (
      <div className="alert alert-danger">
        {this.props.error}
      </div>
    )
  };

  submitButton = (enabled) => {
    return (
      <input
        type="submit"
        value="Submit"
        disabled={!enabled}
        className="btn btn-primary btn-block" />
    )
  }

  render() {
    const {email, password, confirm} = this.state;
    const errors = this.validate(email, password, confirm);
    const isValid = !Object.keys(errors).some(x => errors[x]);

    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display text-center">Register</h1>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    onChange={this.onChange}
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="user@email.com"
                    name="email"
                    value={this.state.email}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    onChange={this.onChange}
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="password (at least 8 characters)"
                    name="password"
                    value={this.state.password}
                    required
                  />
                </div>
                <div className="form-group">
                  <input
                    onChange={this.onChange}
                    type="password"
                    className="form-control form-control-lg"
                    placeholder="confirm password"
                    name="confirm"
                    value={this.state.confirm}
                    required
                  />
                </div>
                {this.errorMessage(this.props.error)}
                <input
                  type="submit"
                  value="Submit"
                  disabled={this.props.loading || !isValid}
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
};

const mapStateToProps = (state) => {
  const { error, loading, authenticated } = state.auth;

  return { error, loading, authenticated };
};

export default connect(mapStateToProps, { attemptSignup, openedAuthPage })(Register);