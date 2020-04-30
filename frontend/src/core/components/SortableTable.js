import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import AppDropdown from "./AppDropdown/AppDropdown";
import {Col, Row} from "react-bootstrap";
import {PropTypes} from "prop-types";

class SortableTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSortChange = this.handleSortChange.bind(this);

    this.state = {
      field: "",
      order: "asc",
    };
  }

  handleSort = (field, order) => {
    this.setState({
      field,
      order,
    });
  };

  handleSortChange(field) {
    this.setState({field});
  }

  render() {
    const {
      title,
      columns: allColumns,
      className,
      // eslint-disable-next-line no-unused-vars
      ...restProps
    } = this.props;

    const columns = allColumns.map((col) => {
      return {...col, sort: true};
    });

    const {field, order} = this.state;

    return (
      <>
        <Row className="mb-2">
          <Col lg="8">
            <h3>{title}</h3>
          </Col>
          <Col lg="4">
            <AppDropdown
              onSelect={(field) => this.handleSortChange(field.dataField)}
              options={columns}
            />
          </Col>
        </Row>

        <Row>
          <Col>
            <BootstrapTable
              {...restProps}
              classes={"app-table table-striped " + className}
              columns={columns}
              bordered={false}
              sort={{
                dataField: field,
                order: order,
              }}
            ></BootstrapTable>
          </Col>
        </Row>
      </>
    );
  }
}

SortableTable.defaultProps = {
  className: "",
};

SortableTable.propTypes = {
  className: PropTypes.string,
  title: PropTypes.string,
  columns: PropTypes.array,
  data: PropTypes.array,
};

export default SortableTable;
