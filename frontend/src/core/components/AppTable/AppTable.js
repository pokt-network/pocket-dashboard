import React, {Component} from "react";
import {Table} from "react-bootstrap";
import "./AppTable.scss";
import {PropTypes} from "prop-types";

class AppTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      selectedElements: [],
    };

    this.isActive = this.isActive.bind(this);
    this.toggleColumnActive = this.toggleColumnActive.bind(this);
  }

  isActive(column) {
    const {selectedElements} = this.state;

    return selectedElements.includes(column) ? "active" : "";
  }

  toggleColumnActive(col) {
    const {multiSelect, handleSelect} = this.props;

    let selectedElements = [...this.state.selectedElements];

    if (multiSelect) {
      selectedElements = this.multiColumnToggle(selectedElements, col);
    } else {
      selectedElements = this.isActive(col) ? [] : [col];
    }

    this.setState({selectedElements});

    // Trigger data select change outside
    if (handleSelect) {
      handleSelect(selectedElements);
    }
  }

  multiColumnToggle(selectedElements, col) {
    if (this.isActive(col)) {
      selectedElements = selectedElements.filter(el => el !== col);
    } else {
      selectedElements.push(col);
    }
    return selectedElements;
  }

  render() {
    const {columns, data, hover} = this.props;

    return (
      <Table responsive striped hover={hover} className="app-table">
        <thead>
        <tr>
          {
            columns.map((col, idx) => (<th key={idx}>{col}</th>))
          }
        </tr>
        </thead>
        <tbody>
        {
          data.map((column, idx) => (
            <tr
              onClick={() => this.toggleColumnActive(column)}
              className={this.isActive(column)}
              key={idx}>
              {
                column.map((col, idx) => (<td key={idx}>{col}</td>))
              }
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

AppTable.defaultProps = {
  multiSelect: false,
  hover: true,
};

AppTable.propTypes = {
  columns: PropTypes.array,
  data: PropTypes.array,
  handleSelect: PropTypes.func,
  multiSelect: PropTypes.bool,
  hover: PropTypes.bool
};

export default AppTable;
