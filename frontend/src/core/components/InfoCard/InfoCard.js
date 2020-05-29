import React, {Component} from "react";
import PropTypes from "prop-types";
import "./InfoCard.scss";

class InfoCard extends Component {
  render() {
    const {title, subtitle, className, children} = this.props;

    return (
      <div className={"p-badge " + className}>
        <div className="p-badge-body">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {children}
        </div>
      </div>
    );
  }
}

InfoCard.defaultProps = {
  className: "text-center",
  children: undefined,
};

InfoCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  subtitle: PropTypes.string,
  className: PropTypes.string,
};

export default InfoCard;
