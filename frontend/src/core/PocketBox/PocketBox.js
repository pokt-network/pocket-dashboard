import React, {Component} from "react";
import {PropTypes} from "prop-types";
import "./PocketBox.scss";

class PocketBox extends Component {
  state = {};
  render() {
    const {iconUrl, children} = this.props;

    return (
      <>
        <span id="pocket-box">
          <div className="head"></div>
          <div className="wrapper">
            {/*eslint-disable-next-line jsx-a11y/alt-text*/}
            <img src={iconUrl} id="img" />
            {children}
          </div>
        </span>
      </>
    );
  }
}

PocketBox.propTypes = {
  iconUrl: PropTypes.string,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default PocketBox;
