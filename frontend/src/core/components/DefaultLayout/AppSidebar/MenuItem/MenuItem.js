import React, {Component} from "react";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";

class MenuItem extends Component {
  render() {
    const {url, label, icon, ...restProps} = this.props;
    const iconImageSource = `/assets/${icon}`;

    return (
      <NavLink className="menu-item" to={url} {...restProps}>
        <li>
          <img
            src={iconImageSource}
            alt="sidebar menu item icon"
            className="icon"
          />
          <span>{label}</span>
        </li>
      </NavLink>
    );
  }
}

MenuItem.defaultProps = {
  url: "#",
  icon: "square",
};

MenuItem.propTypes = {
  url: PropTypes.string,
  label: PropTypes.string,
  icon: PropTypes.string,
  size: PropTypes.string,
};

export default MenuItem;
