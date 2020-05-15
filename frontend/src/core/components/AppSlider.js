import React, {Component} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Tooltip from "rc-tooltip";
import {STYLING} from "../../_constants";

class AppSlider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
    };
  }

  onSliderChange = (value) => {
    // eslint-disable-next-line react/prop-types
    const {onChange: doHandleChange} = this.props;

    this.setState({
      value,
    });

    doHandleChange(value);
  };

  render() {
    const {value} = this.state;

    const Handle = Slider.Handle;

    const handle = (props) => {
      // eslint-disable-next-line react/prop-types
      const {value, dragging, index, ...restProps} = props;

      return (
        <Tooltip
          prefixCls="rc-slider-tooltip"
          overlay={`${value} Relays per day`}
          visible={true}
          placement="top"
          key={index}
        >
          <Handle value={value} {...restProps} />
        </Tooltip>
      );
    };

    return (
      <Slider
        {...this.props}
        handle={handle}
        tipFormatter={(value) => `${value}%`}
        value={value}
        onChange={this.onSliderChange}
        railStyle={{backgroundColor: STYLING.whiteSmoke, height: 11}}
        trackStyle={{backgroundColor: STYLING.primaryColor, height: 11}}
        handleStyle={{
          borderColor: "#ffffff",
          height: 28,
          width: 28,
          marginTop: -9,
          backgroundColor: STYLING.primaryColor,
          boxShadow:
            "rgba(0, 0, 0, 0.3) 0px 12px 66px, rgba(0, 0, 0, 0.22) 0px 0px 13px",
        }}
      />
    );
  }
}

export default AppSlider;
