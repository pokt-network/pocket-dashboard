import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";

export default class HelpLink extends Component {
  render() {
    const {link} = this.props;

    return (
      <div className={"help"}>
        <Link to={link}>
            <FontAwesomeIcon size="3x" icon={faQuestionCircle}/>
        </Link>
      </div>
    );
  }
}

HelpLink.defaultProps = {
  link: "#"
};

HelpLink.propTypes = {
  link: PropTypes.string
};
