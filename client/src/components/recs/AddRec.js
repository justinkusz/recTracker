import React, { Component } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Button,
  ButtonGroup,
  Form,
  FormGroup,
  Input,
  ListGroup,
  ListGroupItem,
  InputGroup,
  InputGroupAddon,
  Media
} from "reactstrap";

import { addRec, albumQuery, movieQuery, clearSearch } from "../../actions";
import MovieItem from "../common/MovieItem";

class AddRec extends Component {
  constructor(props) {
    super(props);

    this.state = {
      type: "album",
      title: "",
      url: "",
      recommender: "",
      types: ["album", "book", "show", "movie"],
      showResults: false
    };
  }

  onSubmit = event => {
    event.preventDefault();

    const { type, title, url, recommender, image } = this.state;

    const rec = { type, title, url, recommender, image };

    this.props.addRec(rec).then(() => {
      if (!this.props.error) {
        this.props.history.push("/");
      }
    });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onChangeTitle = event => {
    this.setState(
      {
        title: event.target.value,
        showResults: event.target.value !== ""
      },
      () => {
        switch (this.state.type) {
          case "album":
            this.props.albumQuery(this.state.title);
            break;
          case "movie":
            this.props.movieQuery(this.state.title);
            break;
          default:
            this.props.albumQuery(this.state.title);
        }
      }
    );
  };

  onChangeType = event => {
    this.setState({
      title: "",
      url: "",
      type: event.target.value
    });
  };

  onClearSearch = () => {
    this.setState(
      {
        title: "",
        url: "",
        showResults: false
      },
      () => {
        this.props.clearSearch();
      }
    );
  };

  errorMessage = () => {
    if (!this.props.error) {
      return null;
    }
    return <div className="alert alert-danger mt-2">{this.props.error}</div>;
  };

  

  renderSearchResults = () => {
    if (this.props.queryResults === undefined || !this.state.showResults) {
      return null;
    }

    return (
      <ListGroup>
        {this.props.queryResults.slice(0, 9).map(item => (
          <ListGroupItem
            tag="button"
            key={item.id}
            action
            onClick={() => this.onSelectItem(item)}
          >
            {
              this.state.type === "movie" ? <MovieItem item={item} />
              : item.title
            }
          </ListGroupItem>
        ))}
      </ListGroup>
    );
  };

  onSelectItem = item => {
    const { type } = this.state;

    const url =
      type === "movie"
        ? `https://www.themoviedb.org/movie/${item.id}`
        : type === "album"
        ? `https://www.discogs.com${item.uri}`
        : null;

    const image =
      type === "movie"
        ? `https://image.tmdb.org/t/p/w154/${item.poster_path}`
        : type === "album"
        ? item.thumb
        : null;

    this.setState({
      ...this.state,
      title: item.title,
      image,
      url,
      showResults: false
    });
  };

  render() {
    if (!this.props.authenticated) {
      return <Redirect to="/login" />;
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <Form
              onSubmit={this.onSubmit}
              className="mx-auto"
              style={{ paddingTop: "60px", width: "50%" }}
            >
              <FormGroup>
                <ButtonGroup size="lg" className="my-2">
                  {this.state.types.map(type => (
                    <Button
                      onClick={this.onChangeType}
                      key={type}
                      value={type}
                      color={type === this.state.type ? "primary" : "secondary"}
                    >
                      {type}
                    </Button>
                  ))}
                </ButtonGroup>
                <InputGroup>
                  <Input
                    type="text"
                    value={this.state.title}
                    placeholder="title"
                    onChange={this.onChangeTitle}
                    name="title"
                    required
                  />
                  <InputGroupAddon addonType="append">
                    <Button onClick={this.onClearSearch}>clear</Button>
                  </InputGroupAddon>
                </InputGroup>
                {this.renderSearchResults()}

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
                <Button color="primary" className="btn-block" type="submit">
                  Add Rec
                </Button>
              </FormGroup>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { user, authenticated } = state.auth;
  const { error, loading } = state.recs;
  const queryResults = state.search.results;
  const queryError = state.search.error;

  return {
    user,
    authenticated,
    error,
    loading,
    queryResults,
    queryError
  };
};

export default connect(
  mapStateToProps,
  { addRec, albumQuery, movieQuery, clearSearch }
)(AddRec);
