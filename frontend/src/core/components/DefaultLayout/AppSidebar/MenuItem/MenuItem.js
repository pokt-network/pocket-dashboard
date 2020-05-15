import React, {Component} from "react";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

class MenuItem extends Component {
  render() {
    const {url, label, icon, size, ...restProps} = this.props;

    return (
      <NavLink to={url} {...restProps}>
        <li>
          <img
            style={{width: "10%"}}
            src={`/assets/${icon}.svg`}
            className="icon"
            alt=""
          />
          {label}
        </li>
      </NavLink>
    );
  }
}

MenuItem.defaultProps = {
  url: "#",
  icon: "square",
  size: "2x",
};

MenuItem.propTypes = {
  url: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.string,
};

export default MenuItem;
