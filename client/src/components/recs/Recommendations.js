import React, { Component } from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { Container, Row, Col, ListGroup, ListGroupItem } from "reactstrap";

import Rec from "./Rec";
import FilterBar from "./FilterBar";

import {
  getRecs,
  dismissAlert,
  addRec,
  deleteRec,
  getRecsByRecommender
} from "../../actions";

class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.props.getRecs();
  }

  renderAlert = () => {
    if (!this.props.alert) {
      return null;
    }

    const { type, message } = this.props.alert;

    return (
      <div
        style={{ width: "500px" }}
        className={`fixed-bottom alert alert-${type} alert-dismissible fade show mx-auto`}
        role="alert"
      >
        {message}

        <button
          onClick={this.props.dismissAlert}
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close"
        >
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  };

  renderRecs = () => {
    if (this.props.recs.length === 0 && !this.props.loading) {
      return (
        <div style={{ paddingTop: 60, textAlign: "center" }}>
          <h1>I ain't got nothin' for you, man</h1>
          <Link to="/add-rec">Try adding a rec</Link>
        </div>
      );
    }

    var recs = this.props.recs;

    if (this.props.filter.query) {
      recs = recs.filter(rec => {
        const title = rec.title.toLowerCase();
        const recommender = rec.recommender.toLowerCase();
        const filter = this.props.filter.query.toLowerCase();

        return title.includes(filter) || recommender.includes(filter);
      });
    }

    if (this.props.filter.consumed !== undefined) {
      recs = recs.filter(rec => {
        return rec.consumed === this.props.filter.consumed;
      });
    }

    if (this.props.filter.type !== undefined) {
      recs = recs.filter(rec => {
        return rec.type === this.props.filter.type;
      });
    }

    if (recs.length === 0 && !this.props.loading) {
      return (
        <div style={{ paddingTop: 60, textAlign: "center" }}>
          <h1>I ain't got nothin' for you, man</h1>
        </div>
      );
    }

    return (
      <Row>
        <Col>
          <ListGroup>
            {recs.map(rec => (
              <ListGroupItem key={rec.title} action>
                <Rec rec={rec} />
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    );
  };

  render() {
    if (!this.props.authenticated) {
      return <Redirect to="/login" />;
    }

    setTimeout(this.props.dismissAlert, 5000);
    return (
      <Container>
        <FilterBar />
        {this.renderRecs()}
        {this.renderAlert()}
      </Container>
    );
  }
}

const mapStateToProps = state => {
  const { recs, filter, loading, alert } = state.recs;
  const { authenticated } = state.auth;

  return { recs, filter, loading, alert, authenticated };
};

export default connect(
  mapStateToProps,
  {
    getRecs,
    dismissAlert,
    addRec,
    deleteRec,
    getRecsByRecommender
  }
)(Recommendations);
