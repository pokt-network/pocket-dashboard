import React, {Component} from "react";
import "./Segment.scss";
import AppDropdown from "../AppDropdown/AppDropdown";
import {PropTypes} from "prop-types";

class Segment extends Component {
  constructor(props, context) {
    super(props, context);

    this.renderDropdown = this.renderDropdown.bind(this);
  }

  renderDropdown(options, onSelect) {
    if (options !== undefined && onSelect !== undefined) {
      return <AppDropdown options={options} onSelect={onSelect} />;
    }
  }

  render() {
    const {children, label, dropdownOptions, dropdownOnSelect} = this.props;

    return (
      <div className="app-segment">
        <div className="head">
          <h2 className="title">{label}</h2>
          {this.renderDropdown(dropdownOptions, dropdownOnSelect)}
        </div>
        <div className="body">{children}</div>
      </div>
    );
  }
}

Segment.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  label: PropTypes.string,
  dropdownOptions: PropTypes.arrayOf(
    PropTypes.shape({
      dataField: PropTypes.string,
      text: PropTypes.string,
    })
  ),
  dropdownOnSelect: PropTypes.func,
};

export default Segment;
