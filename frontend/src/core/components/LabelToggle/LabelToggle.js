/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {STYLING} from "../../../constants";
import PropTypes from "prop-types";
import "./LabelToggle.scss";

// eslint-disable-next-line react/display-name
const LabelToggle = React.forwardRef(({children, onClick}, ref) => (
  <a
    className="label-dropdown"
    style={{color: "black"}}
    href=""
    ref={ref}
    onClick={(e) => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <p id="label">{children}</p>
    <FontAwesomeIcon
      className="icon"
      icon={faAngleDown}
      color={STYLING.primaryColor}
    />
  </a>
));

LabelToggle.propTypes = {
  children: PropTypes.any,
  onClick: PropTypes.func,
};

export default LabelToggle;
