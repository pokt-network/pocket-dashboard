import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import {STYLING} from "../../constants";

export default class HelpLink extends Component {
  render() {
    const {link, size} = this.props;

    return (
      <div style={{marginTop: "4px"}}>
        <Link to={link}>
          <FontAwesomeIcon
            size={size}
            color={STYLING.primaryColor}
            icon={faQuestionCircle}
          />
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
