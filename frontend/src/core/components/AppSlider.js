import React, {Component} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import {STYLING} from "../../_constants";
import {formatNumbers} from "../../_helpers";

class AppSlider extends Component {
  constructor(props) {
    super(props);

    // eslint-disable-next-line react/prop-types
    const {defaultValue} = this.props;

    this.state = {
      value: defaultValue || 0,
    };
  }

  onSliderChange = (value) => {
    this.setState({
      value,
    });
  };

  render() {
    const {value} = this.state;

    // eslint-disable-next-line react/prop-types
    const {onChange} = this.props;

    const Handle = Slider.Handle;

    const handle = (props) => {
      // eslint-disable-next-line react/prop-types
      const {value, dragging, index, ...restProps} = props;

      return (
        <Tooltip
          prefixCls="rc-slider-tooltip"
          overlay={`${formatNumbers(value)}`}
          visible={true}
          placement="top"
          key={index}
          getTooltipContainer={() => document.getElementById("slider")}
        >
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };

    return (
      <div id="slider" className="slider-container">
        <Slider
          {...this.props}
          handle={handle}
          tipFormatter={(value) => `${value}%`}
          value={value}
          onChange={this.onSliderChange}
          onAfterChange={() => onChange(value)}
          railStyle={{backgroundColor: STYLING.whiteSmoke, height: 10}}
          trackStyle={{backgroundColor: STYLING.primaryColor, height: 10}}
          handleStyle={{
            borderColor: "#fbfdff",
            height: 28,
            width: 28,
            marginTop: -9,
            backgroundColor: STYLING.primaryColor,
            boxShadow:
              "rgba(0, 0, 0, 0.3) 0px 12px 66px, 0 2px 8px 2px rgba(6, 32, 46, 0.36)",
          }}
        />
      </div>
    );
  }
}

export default AppSlider;
