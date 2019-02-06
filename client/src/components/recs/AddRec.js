import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { addRec } from '../../actions';

class AddRec extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: 'album',
      title: '',
      url: '',
      recommender: '',
      types: ['album', 'book', 'show', 'movie']
    }
  }

  onSubmit = (event) => {
    event.preventDefault();

    const { type, title, url, recommender } = this.state;
    
    const rec = {type, title, url, recommender};

    this.props.addRec(rec).then(() => {
      if (!this.props.error) {
        this.props.history.push("/");
      }
    });
  };

  onChange = (event) => {
    this.setState({[event.target.name]: event.target.value});
  }

  errorMessage = () => {
    if (!this.props.error) {
      return null;
    }
    return (
      <div className="alert alert-danger mt-2">
        {this.props.error}
      </div>
    )
  };

  render() {
    if (!this.props.authenticated) {
      return (
        <Redirect to="/login" />
      )
    }

    return (
      <Form
        onSubmit={this.onSubmit}
        className="mx-auto"
        style={{paddingTop: "60px", width: "50%"}}>
        <FormGroup>
          <Input type="select" name="type" onChange={this.onChange}>
            {this.state.types.map(type => <option key={type} value={type}>{type}</option>)}
          </Input>
          <Input
            className="my-2"
            type="text"
            value={this.state.title}
            placeholder="title"
            onChange={this.onChange}
            name="title"
            required />
          <Input
            className="my-2"
            type="text"
            value={this.state.url}
            placeholder="url"
            onChange={this.onChange}
            name="url"
            required
          />
          <Input 
            className="my-2"
            type="text"
            value={this.state.recommender}
            placeholder="recommender"
            onChange={this.onChange}
            name="recommender"
            required
          />
          {this.errorMessage()}
          <Button
            color="primary"
            className="btn-block"
            type="submit">
            Add Rec
          </Button>
        </FormGroup>
      </Form>
    )
  }
};

const mapStateToProps = (state) => {
  const { user, authenticated } = state.auth;
  const { error, loading } = state.recs;

  return { user, authenticated, error, loading };
}

export default connect(mapStateToProps, {addRec})(AddRec);