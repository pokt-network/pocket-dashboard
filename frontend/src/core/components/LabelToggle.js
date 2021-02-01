/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { STYLING } from "../../_constants";
import PropTypes from "prop-types";

// eslint-disable-next-line react/display-name
const LabelToggle = React.forwardRef(({ children, onClick }, ref) => (
  <a
    className="label-dropdown"
    href=""
    ref={ref}
    onClick={e => {
      e.preventDefault();
      onClick(e);
    }}
  >
    <span id="label">{children}</span>
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
