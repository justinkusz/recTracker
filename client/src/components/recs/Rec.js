import React, { Component } from "react";
import { connect } from 'react-redux';
import bookLogo from '../../assets/img/icons/book-open.png'
import albumLogo from '../../assets/img/icons/disc.png';
import movieLogo from '../../assets/img/icons/film.png';
import showLogo from '../../assets/img/icons/tv.png';
import { Button, Media, ButtonGroup } from 'reactstrap';

import {
  updateRec,
  getRecs,
  deleteRec,
  getRecsByRecommender,
  filterRecs
} from '../../actions';

class Rec extends Component {
  constructor(props) {
    super(props);

    this.state = {
      consumed: this.props.rec.consumed
    };
  }
  
  renderConsumedButton = (consumed, type) => {
    const types = {
      'album': 'Listened',
      'book': 'Read',
      'movie': 'Watched',
      'show': 'Watched'
    };

    return (
      <Button
        size="sm"
        outline
        onClick={this.toggleConsumed}
        color="primary"
        type="button">
        Mark as {consumed ? 'New' : types[type]}
      </Button> 
    )
  }

  toggleConsumed = () => {
    this.setState({
      consumed: !this.state.consumed
    });

    this.props.updateRec({
      ...this.props.rec,
      consumed: !this.props.rec.consumed
    });
  }

  onRemove = () => {
    this.props.deleteRec(this.props.rec);
  };

  onClickRecommender = () => {
    this.props.filterRecs({query: this.props.rec.recommender});
  }

  render() {
    const {title, recommender, url, type, consumed, image} = this.props.rec;
    const logoTypes = {
      'album': albumLogo,
      'book': bookLogo,
      'movie': movieLogo,
      'show': showLogo
    };

    const logo = logoTypes[type];

    return (
      <Media className="my-2 py-2 border border-primary">
        <Media left>
          <Media object src={(image) ? image : logo} />
        </Media>
        <Media body className="ml-2">
          <Media heading>
            <a rel="noopener noreferrer" target="_blank" href={url}>{title}</a>
          </Media>
          Recommended by <Button size="sm" outline onClick={this.onClickRecommender}>{recommender}</Button>
          <Media left>
          <ButtonGroup className="mt-2">
            {this.renderConsumedButton(consumed, type)}
            <Button
              size="sm"
              outline
              color="danger"
              disabled={this.props.updatingRec === this.props.rec._id}
              onClick={this.onRemove}
              type="button">
              Remove
            </Button>
          </ButtonGroup>
        </Media>
        </Media>
      </Media>
    )
  }
}

const mapStateToProps = (state) => {
  const {updatingRec} = state.recs;
  const {consumed} = state;

  return {updatingRec, consumed};
}

export default connect(mapStateToProps, {
  updateRec,
  getRecs,
  deleteRec,
  getRecsByRecommender,
  filterRecs
})(Rec);