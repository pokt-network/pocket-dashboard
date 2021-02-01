import React, { Component } from "react";
import { Dropdown } from "react-bootstrap";
import { PropTypes } from "prop-types";
import "./AppDropdown.scss";
import LabelToggle from "../LabelToggle";

class AppDropdown extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      selected: "",
    };
  }

  handleSelect({ target: input }) {
    const selected = input.text;

    const { onSelect, options } = this.props;

    this.setState({ selected });

    const idx = options.map((op) => op.text).indexOf(selected);

    onSelect(options[idx]);
  }

  componentDidMount() {
    const { options, defaultText } = this.props;
    const selected = defaultText ? defaultText : options[0].text;

    this.setState({ selected });
  }

  render() {
    const { options } = this.props;
    const { selected } = this.state;

    return (
      <Dropdown alignRight className="app-dropdown">
        <Dropdown.Toggle as={LabelToggle} id="dropdown-basic">
          {selected}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {options.map((op) => (
            <Dropdown.Item onClick={this.handleSelect} key={op.text}>
              {op.text}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

AppDropdown.propTypes = {
  defaultText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      dataField: PropTypes.string,
      text: PropTypes.string,
    })
  ),
  onSelect: PropTypes.func,
};

export default AppDropdown;
