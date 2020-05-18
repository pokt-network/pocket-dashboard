import React, {Component} from "react";
import {PropTypes} from "prop-types";
import {Alert} from "react-bootstrap";

class AppAlert extends Component {
  renderTitle(title) {
    if (typeof title === "string") {
      return <h4>{title}</h4>;
    } else {
      return title;
    }
  }

  render() {
    const {title, children, className, variant, ...restProps} = this.props;

    const iconPaths = {
      warning: "/assets/yellow_alert.svg",
      danger: "/assets/red_alert.svg",
    };

    return (
      <Alert id="alert" className={className} variant={variant} {...restProps}>
        <span className="head">
          {iconPaths[variant] && (
            <img src={iconPaths[variant]} className="icon" alt="" />
          )}
          {this.renderTitle(title)}
        </span>
        <div style={{marginLeft: iconPaths[variant] ? 60 : 0}} className="body">
          {children}
        </div>
      </Alert>
    );
  }
}

AppAlert.defaultProps = {
  variant: "primary",
  className: "",
};

AppAlert.propTypes = {
  variant: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  title: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
    PropTypes.string,
  ]),
  restProps: PropTypes.any,
  className: PropTypes.string,
};

export default AppAlert;
