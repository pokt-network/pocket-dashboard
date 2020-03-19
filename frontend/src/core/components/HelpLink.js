import React, {Component} from "react";
import {Link} from "react-router-dom";
import PropTypes from "prop-types";
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faQuestionCircle} from "@fortawesome/free-solid-svg-icons";
import "../../scss/Core.scss";

export default class HelpLink extends Component {
  render() {
    const {link} = this.props;

    return (
      <div className={"help"}>
        <Link to={link}>
          <Button variant={"link"}>
            <FontAwesomeIcon icon={faQuestionCircle}/>
          </Button>
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
