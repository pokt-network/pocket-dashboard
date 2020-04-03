import React, {Component} from "react";
import {Dropdown} from "react-bootstrap";
import {PropTypes} from "prop-types";
import "./AppDropdown.scss";

class AppDropdown extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSelect = this.handleSelect.bind(this);

    this.state = {
      selected: "",
    };
  }

  handleSelect({target: input}) {
    const selected = input.text;

    const {onSelect} = this.props;

    this.setState({selected});

    onSelect(selected);
  }

  componentDidMount() {
    const {options} = this.props;

    const selected = options[0];

    this.setState({selected});
  }

  render() {
    const {options} = this.props;
    const {selected} = this.state;

    return (
      <Dropdown className="app-dropdown">
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          {selected}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {options.map(op => (
            <Dropdown.Item onClick={this.handleSelect} key={op}>
              {op}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    );
  }
}

AppDropdown.propTypes = {
  options: PropTypes.array,
  onSelect: PropTypes.func,
};

export default AppDropdown;
