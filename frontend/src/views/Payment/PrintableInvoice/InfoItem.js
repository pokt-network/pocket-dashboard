import React from "react";
import PropTypes from "prop-types";

const InfoItem = ({text, value}) => (
  <div className="invoice-info">
    <span>{text}</span>
    <span>{value}</span>
  </div>
);

InfoItem.defaultProps = {
  text: "",
  value: "",
};

InfoItem.propTypes = {
  text: PropTypes.string,
  value: PropTypes.string,
};

export default InfoItem;
