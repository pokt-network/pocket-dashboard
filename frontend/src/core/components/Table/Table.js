import React, {Component} from "react";
import {Table} from "react-bootstrap";
import "./Table.scss";
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
    const {multiSelect} = this.props;

    let selectedElements = [...this.state.selectedElements];

    if (multiSelect) {
      selectedElements = this.multiColumnToggle(selectedElements, col);
    } else {
      selectedElements = [col];
    }

    this.setState({selectedElements});

    // Trigger data select change outside
    this.props.handleSelect(selectedElements);
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
    const {columns, columnData} = this.props;

    return (
      <Table hover className="app-table">
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {columnData.map((column, idx) => (
            <tr
              onClick={() => this.toggleColumnActive(column)}
              className={this.isActive(column)}
              key={idx}
            >
              {column.map((col, idx) => (
                <td key={idx}>{col}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }
}

AppTable.defaultProps = {
  multiSelect: false,
};

AppTable.propTypes = {
  columns: PropTypes.array,
  columnData: PropTypes.array,
  handleSelect: PropTypes.func,
  multiSelect: PropTypes.bool,
};

export default AppTable;
