import React, {Component} from "react";
import "./Segment.scss";
import {PropTypes} from "prop-types";
import cls from "classnames";

class Segment extends Component {
  render() {
    const {children, label, sideItem, scroll, bordered, empty} = this.props;

    return (
      <div
        className={cls("app-segment", {
          scrollable: scroll,
          bordered: bordered,
          "is-empty": empty,
        })}
      >
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
  bordered: false,
  empty: false,
};

Segment.propTypes = {
  scroll: PropTypes.bool,
  bordered: PropTypes.bool,
  empty: PropTypes.bool,
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
