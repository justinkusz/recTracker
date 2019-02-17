import React from "react";
import { Media } from "reactstrap";

const MovieItem = props => {
  const imageURL = `https://image.tmdb.org/t/p/w92/${props.item.poster_path}`;
  return (
    <Media>
      <Media left>
        <Media object src={imageURL} />
      </Media>
      <Media body>
        <Media heading>{props.item.title} ({props.item.release_date.substring(0,4)})</Media>
      </Media>
    </Media>
  );
};

export default MovieItem;
