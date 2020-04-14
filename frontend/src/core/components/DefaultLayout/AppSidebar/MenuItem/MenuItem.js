import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {fas} from "@fortawesome/free-solid-svg-icons";
import PropTypes from "prop-types";
import {library} from "@fortawesome/fontawesome-svg-core";
import {Link} from "react-router-dom";

library.add(fas);

class MenuItem extends Component {
  render() {
    const {url, label, icon} = this.props;

    return (
      <Link to={url}>
        <li>
          <FontAwesomeIcon icon={icon} size="2x" className="icon" />
          {label}
        </li>
      </Link>
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
};

export default MenuItem;
