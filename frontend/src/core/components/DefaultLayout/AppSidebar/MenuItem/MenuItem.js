import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSquare} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";

class MenuItem extends Component {
  render() {
    const {url, label} = this.props;

    return (
      <a href={url}>
        <li>
          <FontAwesomeIcon icon={faSquare} size="2x" className="icon" />
          {label}
        </li>
      </a>
    );
  }
}

MenuItem.defaultProps = {
  url: "#",
};

MenuItem.propTypes = {
  url: PropTypes.string,
  label: PropTypes.string,
};

export default MenuItem;
