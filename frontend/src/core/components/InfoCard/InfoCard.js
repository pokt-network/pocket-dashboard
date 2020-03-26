import React, {Component} from "react";
import PropTypes from "prop-types";
import "./InfoCard.scss";

class InfoCard extends Component {
  render() {
    const {title, subtitle} = this.props;

    return (
      <div className="p-badge">
        <div className="p-badge-body">
          <h1>{title}</h1>
          <p>{subtitle}</p>
        </div>
      </div>
    );
  }
}

InfoCard.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string
};

export default InfoCard;
