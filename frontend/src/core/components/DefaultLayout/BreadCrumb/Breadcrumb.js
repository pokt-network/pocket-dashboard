import React, {Component} from "react";
import {Breadcrumb} from "react-bootstrap";
import PropTypes from "prop-types";
import "./BreadCrumb.scss";

class Breadcrumbs extends Component {
  render() {
    const {links} = this.props;

    return (
      <div id="breadcrumbs" style={{width: "100%"}}>
        <Breadcrumb>
          {links.map((link, idx) => (
            <Breadcrumb.Item
              className={idx === 0 ? "pl-4" : ""}
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
