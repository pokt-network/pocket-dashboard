import React, {Component} from "react";
import {Breadcrumb} from "react-bootstrap";
import PropTypes from "prop-types";

class Breadcrumbs extends Component {
  render() {
    const {links} = this.props;

    return (
      <div style={{width: "100%"}}>
        <Breadcrumb>
          {links.map(link => (
            <Breadcrumb.Item
              active={link.active}
              href={link.url}
              key={link.url}
            >
              {link.label}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      </div>
    );
  }
}

Breadcrumbs.propTypes = {
  links: PropTypes.arrayOf(
    PropTypes.shape({
      url: PropTypes.string,
      label: PropTypes.string,
      active: PropTypes.bool,
    })
  ),
};

export default Breadcrumbs;
