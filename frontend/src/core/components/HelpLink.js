import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

export default class HelpLink extends Component {
  render() {
    const {link, size} = this.props;

    return (
      <div className={"help"}>
        <Link to={link}>
          <FontAwesomeIcon size={size} icon={faQuestionCircle} />
        </Link>
      </div>
    );
  }
}

HelpLink.defaultProps = {
  link: "#",
  size: "3x",
};

HelpLink.propTypes = {
  link: PropTypes.string,
  size: PropTypes.string,
};
