import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquare} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

class MenuItem extends Component {
  render() {
    const {url, text} = this.props;

    return (
      <a href={url}>
        <li><FontAwesomeIcon icon={faSquare} size="2x" className="icon"/>{text}</li>
      </a>
    );
  }
}

MenuItem.defaultProps = {
  url: "#"
};

MenuItem.propTypes = {
  url: PropTypes.string,
  text: PropTypes.string
};

export default MenuItem;
