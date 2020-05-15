import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {library} from "@fortawesome/fontawesome-svg-core";
import {NavLink} from "react-router-dom";

library.add(fas);

class MenuItem extends Component {
  render() {
    const {url, label, icon, size, ...restProps} = this.props;

    return (
      <NavLink to={url} {...restProps}>
        <li>
          <FontAwesomeIcon icon={icon} size={size} className="icon" />
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
