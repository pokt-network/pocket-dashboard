import React, {Component} from "react";
import "./Segment.scss";
import {PropTypes} from "prop-types";

class Segment extends Component {
  render() {
    const {children, label, sideItem, scroll} = this.props;

    return (
      <div className={`app-segment ${scroll ? "scroll" : ""}`}>
        <div className="head">
          <h2 className="title">{label}</h2>
          {sideItem}
        </div>
        <div className="body">{children}</div>
      </div>
    );
  }
}

Segment.defaultProps = {
  scroll: true,
};

Segment.propTypes = {
  scroll: PropTypes.bool,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  label: PropTypes.string,
  sideItem: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

export default Segment;
