import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import AppDropdown from "./AppDropdown/AppDropdown";
import {Col, Row} from "react-bootstrap";
import {PropTypes} from "prop-types";

class SortableTable extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSortChange = this.handleSortChange.bind(this);

    this.NETWORK_TABLE_COLUMNS = [
      {
        dataField: "name",
        text: "Network",
        sort: true,
      },
      {
        dataField: "netID",
        text: "Network Identifier (NetID)",
      },
      {
        dataField: "hash",
        text: "Hash",
      },
    ];

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
    const {title, columns: allColumns, data} = this.props;

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
              classes="table-responsive app-table table-striped"
              keyField="hash"
              data={data}
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

SortableTable.propTypes = {
  title: PropTypes.string,
  columns: PropTypes.array,
  data: PropTypes.array,
};

export default SortableTable;
