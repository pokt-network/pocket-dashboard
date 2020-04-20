import React, {Component} from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";

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

    return (
      <Slider
        {...this.props}
        value={value}
        onChange={this.onSliderChange}
        railStyle={{backgroundColor: "#3a3a3a", height: 8}}
        trackStyle={{backgroundColor: "#3a3a3a", height: 8}}
        handleStyle={{
          borderColor: "#828282",
          height: 28,
          width: 28,
          marginTop: -9,
          backgroundColor: "#828282",
        }}
      />
    );
  }
}

export default AppSlider;
