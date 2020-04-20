import React, {Component} from "react";
import "rc-steps/assets/index.css";
import Steps, {Step} from "rc-steps";
import "./AppSteps.scss";
import {PropTypes} from "prop-types";

class AppSteps extends Component {
  state = {};
  render() {
    const {current, steps} = this.props;

    return (
      <span className="app-steps">
        <Steps labelPlacement="vertical" current={current}>
          {steps.map((step, idx) => (
            <Step key={idx} title={step} />
          ))}
        </Steps>
      </span>
    );
  }
}

AppSteps.propTypes = {
  current: PropTypes.number,
  steps: PropTypes.arrayOf(PropTypes.string),
};

export default AppSteps;
