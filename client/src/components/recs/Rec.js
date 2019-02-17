import React, { Component } from "react";
import { connect } from "react-redux";
import bookLogo from "../../assets/img/icons/book-open.png";
import albumLogo from "../../assets/img/icons/disc.png";
import movieLogo from "../../assets/img/icons/film.png";
import showLogo from "../../assets/img/icons/tv.png";
import {
  Button,
  Media,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from "reactstrap";

import {
  updateRec,
  getRecs,
  deleteRec,
  getRecsByRecommender,
  filterRecs
} from "../../actions";

class Rec extends Component {
  constructor(props) {
    super(props);

    this.state = {
      consumed: this.props.rec.consumed,
      showModal: false
    };
  }

  renderConsumedButton = () => {
    const { consumed, type } = this.props.rec;

    const types = {
      album: "Listened",
      book: "Read",
      movie: "Watched",
      show: "Watched"
    };

    return (
      <Button onClick={this.toggleConsumed} color="primary" type="button">
        Mark as {consumed ? "New" : types[type]}
      </Button>
    );
  };

  toggleConsumed = () => {
    this.setState({
      consumed: !this.state.consumed,
      showModal: false
    });

    this.props.updateRec({
      ...this.props.rec,
      consumed: !this.props.rec.consumed
    });
  };

  onRemove = () => {
    this.setState({
      showModal: false
    });
    this.props.deleteRec(this.props.rec);
  };

  onClickRecommender = () => {
    this.props.filterRecs({ query: this.props.rec.recommender });
  };

  render() {
    const { title, recommender, url, type, consumed, image } = this.props.rec;
    const logoTypes = {
      album: albumLogo,
      book: bookLogo,
      movie: movieLogo,
      show: showLogo
    };

    const logo = logoTypes[type];

    return (
      <div onClick={this.toggleModal}>
        {this.renderModal()}
        <Media>
          <Media left>
            <Media object src={image ? image : logo} />
          </Media>
          <Media body className="ml-2">
            <Media heading>{title}</Media>
            Recommended by {recommender}
          </Media>
        </Media>
      </div>
    );
  }

  toggleModal = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  renderModal = () => {
    return (
      <Modal isOpen={this.state.showModal} toggle={this.toggleModal}>
        <ModalHeader toggle={this.toggleModal}>
          {this.props.rec.title}
        </ModalHeader>
        <ModalBody>
          <p>Recommended by {this.props.rec.recommender}</p>
          <p>
            <a
              href={this.props.rec.url}
              target="_blank"
              rel="noopener noreferrer"
            >
              See more details
            </a>
          </p>
        </ModalBody>
        <ModalFooter>
          {this.renderConsumedButton()}
          <Button color="danger" onClick={this.onRemove}>
            Remove
          </Button>
        </ModalFooter>
      </Modal>
    );
  };
}

const mapStateToProps = state => {
  const { updatingRec } = state.recs;
  const { consumed } = state;

  return { updatingRec, consumed };
};

export default connect(
  mapStateToProps,
  {
    updateRec,
    getRecs,
    deleteRec,
    getRecsByRecommender,
    filterRecs
  }
)(Rec);
