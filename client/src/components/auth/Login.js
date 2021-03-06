import React, { Component } from "react";
import { connect } from "react-redux";
import { attemptLogin } from "../../actions";
import { Redirect } from "react-router-dom";
import { Button, Form, FormGroup, Input } from "reactstrap";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: "",
      password: "",
      submitted: false
    };
  }

  componentDidMount() {
    this.setState({
      email: "",
      password: "",
      submitted: false
    });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    event.preventDefault();

    const { email, password } = this.state;

    this.setState({
      submitted: true
    });

    this.props.attemptLogin({ email, password });
  };

  errorMessage = () => {
    if (!this.props.error || !this.state.submitted) {
      return null;
    }
    return <div className="alert alert-danger">{this.props.error}</div>;
  };

  render() {
    if (this.props.authenticated) {
      return <Redirect to="/" />;
    }

    return (
      <Form
        onSubmit={this.onSubmit}
        className="text-center mx-auto"
        style={{ paddingTop: "60px", width: "50%" }}
      >
        <h1>Login</h1>
        <FormGroup>
          <Input
            className="my-2"
            onChange={this.onChange}
            type="email"
            placeholder="user@email.com"
            name="email"
            value={this.state.email}
            required
          />
          <Input
            className="my-2"
            onChange={this.onChange}
            type="password"
            placeholder="password"
            name="password"
            value={this.state.password}
            required
          />
          {this.errorMessage()}
          <Button
            color="primary"
            className="btn-block"
            type="submit"
            disabled={this.props.loading}
          >
            Submit
          </Button>
        </FormGroup>
      </Form>
    );
  }
}

const mapStateToProps = state => {
  const { loginError, loading, authenticated } = state.auth;

  return { error: loginError, loading, authenticated };
};

export default connect(
  mapStateToProps,
  { attemptLogin }
)(Login);
