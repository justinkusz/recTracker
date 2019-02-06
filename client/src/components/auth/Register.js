import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { attemptSignup, openedAuthPage } from '../../actions';
import { Button, Form, FormGroup, Input } from 'reactstrap';

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
    this.props.openedAuthPage();
  }

  onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmit = (event) => {
    event.preventDefault();

    const { email, password } = this.state;

    this.props.attemptSignup({email, password});
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
    if (this.props.authenticated) {
      return <Redirect to="/" />
    }

    const {email, password, confirm} = this.state;
    const errors = this.validate(email, password, confirm);
    const isValid = !Object.keys(errors).some(x => errors[x]);

    return (
      <Form
        onSubmit={this.onSubmit}
        className="text-center mx-auto"
        style={{paddingTop: "60px", width: "50%"}}>
        <h1>Register</h1>
        <FormGroup>
          <Input 
            onChange={this.onChange}
            type="email"
            name="email"
            className="my-2"
            placeholder="user@email.com"
            value={this.state.email}
            required
          />
          <Input
            onChange={this.onChange}
            type="password"
            className="my-2"
            placeholder="password (at least 8 characters"
            name="password"
            value={this.state.password}
            required
          />
          <Input
            onChange={this.onChange}
            type="password"
            className="my-2"
            placeholder="confirm password"
            name="confirm"
            value={this.state.confirm}
            required
          />
          {this.errorMessage(this.props.error)}
          <Button
            type="submit"
            color="primary"
            className="btn-block"
            disabled={this.props.loading || !isValid}>
            Submit
          </Button>
        </FormGroup>
      </Form>
    )
  }
};

const mapStateToProps = (state) => {
  const { error, loading, authenticated } = state.auth;

  return { error, loading, authenticated };
};

export default connect(mapStateToProps, { attemptSignup, openedAuthPage })(Register);