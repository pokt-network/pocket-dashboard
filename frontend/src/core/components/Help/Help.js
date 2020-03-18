import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

import "./Help.scss";

export default class Help extends Component {
  render() {
    const { link, className } = this.props;

    return (
      <div className={className}>
        <Link to={link}>
          <Button variant={"link"}>
            <FontAwesomeIcon icon={faQuestionCircle} />
          </Button>
        </Link>
      </div>
    );
  }
}

Help.defaultProps = {
  link: "#",
  className: "help"
};

Help.propTypes = {
  link: PropTypes.string,
  className: PropTypes.string
};
