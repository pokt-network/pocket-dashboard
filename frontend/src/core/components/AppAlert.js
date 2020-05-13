import React, {Component} from "react";
import {PropTypes} from "prop-types";
import {Alert} from "react-bootstrap";

class AppAlert extends Component {
  render() {
    const {title, children, variant, ...restProps} = this.props;

    const iconPaths = {
      warning: "/assets/yellow_alert.svg",
      danger: "/assets/red_alert.svg",
    };

    return (
      <Alert variant={variant} {...restProps}>
        <span className="head">
          {iconPaths[variant] && (
            <img src={iconPaths[variant]} className="icon" alt="" />
          )}
          {typeof title === "string" ? <h4>{title}</h4> : {title}}
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
};

export default AppAlert;
