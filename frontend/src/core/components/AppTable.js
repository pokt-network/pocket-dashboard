import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {PropTypes} from "prop-types";
import {tableShow} from "../../_helpers";

class AppTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: true,
    };
  }

  render() {
    const {show} = this.state;
    const {scroll, data, columns, toggle, classes, ...restProps} = this.props;

    let columnsToggle;

    if (toggle) {
      columnsToggle = tableShow(columns, () => {
        this.setState({show: !show});
      });
    }

    return (
      <BootstrapTable
        classes={`app-table ${classes} ${scroll ? "scroll" : ""} ${
          show ? "" : "hide"
        }`}
        keyField="pocketNode.publicPocketAccount.address"
        data={data}
        columns={toggle ? columnsToggle : columns}
        {...restProps}
      />
    );
  }
}

AppTable.defaultProps = {
  scroll: false,
  toggle: false,
  classes: "",
};

AppTable.propTypes = {
  scroll: PropTypes.bool,
  toggle: PropTypes.bool,
  classes: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
};

export default AppTable;
