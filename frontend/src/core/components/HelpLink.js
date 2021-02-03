import React, { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

export default class HelpLink extends Component {
  render() {
    const { link } = this.props;

    return (
      <div className="help-link">
        <Link to={link}>
          <img src="/assets/FAQ.svg" alt="help-link" />
        </Link>
      </div>
    );
  }
}

HelpLink.defaultProps = {
  link: "#",
};

HelpLink.propTypes = {
  link: PropTypes.string,
};
