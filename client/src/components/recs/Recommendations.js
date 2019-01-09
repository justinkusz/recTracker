import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Rec from './Rec';
import { getRecs, dismissAlert, addRec, deleteRec, getRecsByRecommender } from '../../actions';

class Recommendations extends Component {
  constructor(props) {
    super(props);

    this.props.getRecs();
  }

  componentDidMount() {
    
  }

  renderAlert = () => {
    if (!this.props.alert) {
      return null;
    }

    const {type, message} = this.props.alert;
    
    return (
      <div
        style={{width: "500px"}}
        className={`fixed-bottom alert alert-${type} alert-dismissible fade show mx-auto`}
        role="alert">
        {message}
       
        <button
          onClick={this.props.dismissAlert}
          type="button"
          className="close"
          data-dismiss="alert"
          aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    );
  }

  renderRecs = () => {
    if (this.props.recs.length === 0 && !this.props.loading) {
      return (
        <div style={{paddingTop: 60, textAlign: 'center'}}>
          <h1>I ain't got nothin' for you, man</h1>
          <Link to="/add-rec">Try adding a rec</Link>
        </div>
      )
    }

    var recs = this.props.recs;
    
    if (this.props.filter.query) {
      recs = recs.filter((rec) => {
        const title = rec.title.toLowerCase();
        const recommender = rec.recommender.toLowerCase();
        const filter = this.props.filter.query.toLowerCase();

        return title.includes(filter) || recommender.includes(filter)
      });
    }

    if (this.props.filter.consumed !== undefined) {
      recs = recs.filter((rec) => {
        return rec.consumed === this.props.filter.consumed
      });
    }

    if (recs.length === 0 && !this.props.loading) {
      return (
        <div style={{paddingTop: 60, textAlign: 'center'}}>
          <h1>I ain't got nothin' for you, man</h1>
        </div>
      ) 
    }

    return (
      <div className="d-flex flex-row">
        <div className="d-flex flex-column flex-fill">
          {recs.map(rec => <Rec key={rec._id} rec={rec} />)}
        </div>
      </div>
    )
  }

  render() {
    if (!this.props.authenticated) {
      return null;
    };

    setTimeout(this.props.dismissAlert, 5000);
    return (
      <div className="d-flex flex-column flex-fill">
        {this.renderRecs()}
        {this.renderAlert()}
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  const { recs, filter, loading, alert } = state.recs;
  const { authenticated } = state.auth;

  return { recs, filter, loading, alert, authenticated };
};

export default connect(mapStateToProps, {
  getRecs,
  dismissAlert,
  addRec,
  deleteRec,
  getRecsByRecommender
})(Recommendations);