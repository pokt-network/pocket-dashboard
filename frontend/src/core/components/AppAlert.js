import React, {Component} from "react";
import isEmpty from "lodash/isEmpty";
import isString from "lodash/isString";
import {PropTypes} from "prop-types";
import {Alert} from "react-bootstrap";
import {DEFAULT_ERROR_MESSAGE} from "../../_constants";

const VARIANT_DANGER = "danger";

class AppAlert extends Component {
  renderTitle() {
    const {title, variant} = this.props;

    if (isString(title) && !isEmpty(title)) {
      return <h4>{title}</h4>;
    }
    if (isEmpty(title) && variant === VARIANT_DANGER) {
      return <h4>{DEFAULT_ERROR_MESSAGE}</h4>;
    } else {
      if (isString(title)) {
        return <h4>{title}</h4>;
      } else {
        return title;
      }
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
          {title !== undefined && this.renderTitle()}
        </span>
        <div style={{marginLeft: iconPaths[variant] ? 48 : 0}} className="body">
          {children}
        </div>
      </Alert>
    );
  }
}

AppAlert.defaultProps = {
  variant: "primary",
  className: "pt-3 pb-3",
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
