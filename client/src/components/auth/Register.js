import React, { Component } from 'react'

export default class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      confirm: ''
    }
  }

  onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  onSubmit = () => {
    const user = {
      email: this.state.email,
      password: this.state.password
    }
  }

  render() {
    return (
      <div className="register">
        <div className="container">
          <div className="row">
            <div className="col-md-8 m-auto">
              <h1 className="display text-center">Register</h1>
              <form>
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
                <button
                  onClick={this.onSubmit}
                  type="button"
                  className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    )
  }
}