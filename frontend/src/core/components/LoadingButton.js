import React, {Component} from "react";
import {Button, Spinner} from "react-bootstrap";
import {PropTypes} from "prop-types";

class LoadingButton extends Component {
  state = {};
  render() {
    const {children, loading, buttonProps, spinnerProps} = this.props;

    return (
      <Button {...buttonProps}>
        {loading ? <Spinner {...spinnerProps} /> : children}
      </Button>
    );
  }
}

LoadingButton.defaultProps = {
  spinnerProps: {
    as: "span",
    animation: "border",
    size: "sm",
    role: "status",
    "aria-hidden": "true",
  },
};

LoadingButton.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  loading: PropTypes.bool,
  buttonProps: PropTypes.object,
  spinnerProps: PropTypes.object,
};

export default LoadingButton;
