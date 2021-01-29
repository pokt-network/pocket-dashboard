import React, { Component } from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { PropTypes } from "prop-types";
import "./DeletedOverlay.scss";

class DeletedOverlay extends Component {
  state = {};
  render() {
    const { text, buttonText, buttonLink } = this.props;

    return (
      <div style={{ paddingTop: "0px" }} className="deleted-overlay d-flex flex-column align-items-center mt-5">
        <img style={{ height: "440px", width: "440px" }} src={"/assets/trinity-white.svg"} alt="item-deleted-icon" />
        {text}
        <Link style={{
          position : "absolute",
          top: "47%",
          left: "47.5%"
        }} to={buttonLink}>
          <Button>
            <span>{buttonText}</span>
          </Button>
        </Link>
      </div>
    );
  }
}

DeletedOverlay.propTypes = {
  text: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  buttonText: PropTypes.string,
  buttonLink: PropTypes.string,
};

export default DeletedOverlay;
