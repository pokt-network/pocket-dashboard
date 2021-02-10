import React, { Component } from "react";
import cls from "classnames";
import BootstrapTable from "react-bootstrap-table-next";
import { PropTypes } from "prop-types";
import { tableShow } from "../../_helpers";

class AppTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      show: true,
    };
  }

  render() {
    const { show } = this.state;
    const {
      height,
      scroll,
      data,
      columns,
      toggle,
      classes,
      ...restProps
    } = this.props;
    const hasScroll = data.length * 46 > height;
    const empty = data.length === 0;
    const style = {
      height: `${this.props.height}px`,
      display: "contents",
    };

    let columnsToggle;

    if (toggle) {
      columnsToggle = tableShow(columns, () => {
        this.setState({ show: !show });
      });
    }

    return (
      <div style={!empty ? style : undefined}>
        <BootstrapTable
          classes={cls("app-table", classes, {
            scroll: scroll,
            "has-scroll": hasScroll,
            "has-checkbox": this.props.selectRow,
            empty: empty,
            hide: !show,
          })}
          data={data}
          columns={toggle ? columnsToggle : columns}
          {...restProps}
        />
      </div>
    );
  }
}

AppTable.defaultProps = {
  height: 325,
  scroll: false,
  toggle: false,
  classes: "",
  selectRow: undefined,
};

AppTable.propTypes = {
  height: PropTypes.number,
  scroll: PropTypes.bool,
  toggle: PropTypes.bool,
  classes: PropTypes.string,
  data: PropTypes.array,
  columns: PropTypes.array,
  selectRow: PropTypes.object,
};

export default AppTable;
