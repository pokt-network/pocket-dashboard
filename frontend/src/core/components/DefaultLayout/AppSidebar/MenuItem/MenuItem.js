import React, {Component} from "react";
import PropTypes from "prop-types";
import {NavLink} from "react-router-dom";


class MenuItem extends Component {
  render() {
    const {url, label, icon, size, ...restProps} = this.props;
    const iconImageSource = `/assets/${icon}`;

    return (
      <NavLink to={url} {...restProps}>
        <li>
          <img src={iconImageSource} alt="side-bar-menu-item-icon"/>
          <span>{label}</span>
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
