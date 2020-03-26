import React, {Component} from "react";
import PropTypes from "prop-types";
import "./PocketElementCard.scss";

class PocketElementCard extends Component {
  render() {
    const {title, subtitle, iconURL, status} = this.props;

    return (
      <div className="p-card">
        <div className="p-card-body">
          <div className="detail">
            <img src={iconURL} alt="" />
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

PocketElementCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  iconURL: PropTypes.string,
  status: PropTypes.string
};

export default PocketElementCard;
