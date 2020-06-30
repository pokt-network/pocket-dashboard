import React, {Component} from "react";
import PropTypes from "prop-types";
import "./InfoCard.scss";

class InfoCard extends Component {
  render() {
    const {
      title,
      subtitle,
      titleAttrs,
      subtitleAttrs,
      className,
      children,
      flexAlign,
    } = this.props;

    const style = {
      alignItems: flexAlign,
    };

    return (
      <div className={"p-badge " + className} style={style}>
        <div className="p-badge-body">
          <h2 {...titleAttrs}>{title}</h2>
          <p {...subtitleAttrs}>{subtitle}</p>
          {children}
        </div>
      </div>
    );
  }
}

InfoCard.defaultProps = {
  className: "text-center",
  children: undefined,
  flexAlign: "center",
  titleAttrs: undefined,
  subtitleAttrs: undefined,
};

InfoCard.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  titleAttrs: PropTypes.object,
  subtitleAttrs: PropTypes.object,
  subtitle: PropTypes.string,
  className: PropTypes.string,
  flexAlign: PropTypes.string,
};

export default InfoCard;
