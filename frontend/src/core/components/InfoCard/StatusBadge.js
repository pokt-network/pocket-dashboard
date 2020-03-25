import React, { Component } from "react";
import PropTypes from "prop-types";
import "./StatusBadge.scss";

class StatusBadge extends Component {
  render() {
    const { title, subtitle } = this.props;

    return (
      // <div className="status">
      <div className="p-badge">
        <div className="p-badge-body">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
      // </div>
    );
  }
}

StatusBadge.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default StatusBadge;
