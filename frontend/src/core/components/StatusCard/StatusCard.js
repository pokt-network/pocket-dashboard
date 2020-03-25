import React, { Component } from "react";
import PropTypes from "prop-types";
import "./StatusCard.scss";

class StatusCard extends Component {
  render() {
    const { title, subtitle, iconURL, status } = this.props;

    return (
      <div className="p-card">
        <div className="p-card-body">
          <div className="detail">
            <img src={iconURL} />
            <div className="info">
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
          </div>
          <div className="status">
            <p>{status}</p>
          </div>
        </div>
      </div>
    );
  }
}

StatusCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  iconURL: PropTypes.string,
  status: PropTypes.string
};

export default StatusCard;
