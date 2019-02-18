import React from "react";
import { connect } from "react-redux";
import {
  Button,
  Input,
  InputGroup,
  InputGroupAddon,
  Row,
  Col
} from "reactstrap";

import { filterRecs } from "../../actions";

class FilterBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filterName: "New",
      filter: {
        query: "",
        consumed: false
      }
    };
  }

  onChangeSearch = event => {
    this.setState(
      {
        filter: {
          ...this.state.filter,
          query: event.target.value
        }
      },
      () => {
        this.props.filterRecs(this.state.filter);
      }
    );
  };

  onClearSearch = () => {
    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          query: ""
        }
      },
      () => {
        this.props.filterRecs(this.state.filter);
      }
    );
  };

  onToggleType = event => {
    var type = event.target.value;

    type = type === "all" ? undefined : type;

    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          type
        }
      },
      () => {
        this.props.filterRecs(this.state.filter);
      }
    );
  };

  onToggleConsumed = event => {
    const consumed =
      event.target.value === "old"
        ? true
        : event.target.value === "new"
        ? false
        : undefined;

    this.setState(
      {
        ...this.state,
        filter: {
          ...this.state.filter,
          consumed
        }
      },
      () => {
        this.props.filterRecs(this.state.filter);
      }
    );
  };

  render() {
    return (
      <Row className="sticky-top bg-info" style={{marginTop: 60}}>
        <Col lg="2" sm="3" xs="5" className="py-2 mx-1">{this.renderConsumedToggle()}</Col>
        <Col lg="2" sm="3" xs="5" className="py-2 mx-1">{this.renderTypeToggle()}</Col>
        <Col lg="6" sm="6" xs="10" className="py-2 mx-1">{this.renderSearch()}</Col>
      </Row>
    );
  }

  renderConsumedToggle = () => {
    return (
      <Input
        onChange={this.onToggleConsumed}
        defaultValue="new"
        type="select"
        name="consumed"
      >
        <option value="all">All</option>
        <option value="new">New</option>
        <option value="old">Old</option>
      </Input>
    );
  };

  renderTypeToggle = () => {
    return (
      <Input
        onChange={this.onToggleType}
        defaultValue="all"
        type="select"
        name="type"
      >
        <option value="all">All</option>
        <option value="album">Albums</option>
        <option value="book">Books</option>
        <option value="movie">Movies</option>
        <option value="show">TV Shows</option>
      </Input>
    );
  };

  renderSearch = () => {
    return (
      <InputGroup>
        <Input
          type="text"
          name="query"
          placeholder="Search by title/recommender"
          value={this.state.filter.query || this.props.filter.query}
          onChange={this.onChangeSearch}
        />
        <InputGroupAddon addonType="append">
          <Button onClick={this.onClearSearch}>clear</Button>
        </InputGroupAddon>
      </InputGroup>
    );
  };
}

const mapStateToProps = state => {
  const { filter } = state.recs;

  return { filter };
};

export default connect(
  mapStateToProps,
  { filterRecs }
)(FilterBar);
