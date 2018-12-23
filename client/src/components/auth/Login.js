import React, { Component } from 'react'
import { connect } from 'react-redux';
import { attemptLogin, openedAuthPage } from '../../actions';
import { Redirect } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: ''
    };
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

    const { email, password } = this.state;

    this.props.attemptLogin({email, password});
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

  render() {
    if (this.props.authenticated) {
      return (
        <Redirect to="/" />
      )
    }
    return (
      <div className="login">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display text-center">Login</h1>
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
                    placeholder="password"
                    name="password"
                    value={this.state.password}
                    required
                  />
                </div>
                {this.errorMessage(this.props.error)}
                <input
                  type="submit"
                  value="Submit"
                  disabled={this.props.loading}
                  className="btn btn-primary btn-block"
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { error, loading, authenticated } = state.auth;

  return { error, loading, authenticated };
};

export default connect(mapStateToProps, { attemptLogin, openedAuthPage })(Login);