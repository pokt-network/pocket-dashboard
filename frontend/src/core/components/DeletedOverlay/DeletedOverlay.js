import React, {Component} from "react";
import "./DeletedOverlay.scss";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Button} from "react-bootstrap";
import {faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {PropTypes} from "prop-types";

class DeletedOverlay extends Component {
  state = {};
  render() {
    const {text, buttonText, buttonLink} = this.props;

    return (
      <div id="deleted" className="d-flex flex-column align-items-center mt-5">
        <div className="background mb-3">
          <FontAwesomeIcon size="10x" icon={faTrashAlt} />
        </div>
        <p>{text}</p>
        <span>
          <Link to={buttonLink}>
            <Button variant="dark" className="pr-5 pl-5 a1font-weight-bold">
              {buttonText}
            </Button>
          </Link>
        </span>
      </div>
    );
  }
}

DeletedOverlay.propTypes = {
  text: PropTypes.string,
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
};

export default DeletedOverlay;
