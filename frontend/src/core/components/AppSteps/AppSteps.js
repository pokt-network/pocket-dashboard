import React, {Component} from "react";
import "rc-steps/assets/index.css";
import Steps, {Step} from "rc-steps";
import "./AppSteps.scss";
import {PropTypes} from "prop-types";

class AppSteps extends Component {
  state = {};
  render() {
    const {current, steps, icons} = this.props;

    return (
      <span className="app-steps">
        <Steps labelPlacement="vertical" current={current}>
          {steps.map((step, idx) => (
            <Step key={idx} title={step} icon={icons[idx]} />
          ))}
        </Steps>
      </span>
    );
  }
}

AppSteps.propTypes = {
  current: PropTypes.number,
  steps: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.string, PropTypes.node])
  ),
  icons: PropTypes.arrayOf(PropTypes.node),
};

export default AppSteps;
