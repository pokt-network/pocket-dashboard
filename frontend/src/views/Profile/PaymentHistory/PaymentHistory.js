import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./PaymentHistory.scss";
import AppDatePicker from "../../../core/components/AppDatePicker/AppDatePicker";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";
import BootstrapTable from "react-bootstrap-table-next";

// TODO: Remove dummy data and connect to backend
const dummyData = [
  {name: "Example name 1", amount: 200, date: "20-04-2020"},
  {name: "Example name 2", amount: 300, date: "21-04-2020"},
  {name: "Example name 3", amount: 500, date: "22-04-2020"},
  {name: "Example name 4", amount: 100, date: "23-04-2020"},
];

class PaymentHistory extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.renderExport = this.renderExport.bind(this);
    this.handleExport = this.handleExport.bind(this);

    this.state = {
      startDate: new Date(),
      endDate: new Date(),
    };
  }

  handleExport(data) {
    // TODO: Add export to downloadable file functionality
    console.log(data);
  }

  renderExport(cell, row) {
    return (
      <p className="export" onClick={() => this.handleExport(row)}>
        Export
      </p>
    );
  }

  handleDateChange(date, name) {
    this.setState({[name]: date});
  }

  render() {
    const columns = [
      {dataField: "name", text: "App/Node name"},
      {dataField: "amount", text: "Amount"},
      {dataField: "date", text: "Date"},
      {dataField: "export", text: "", formatter: this.renderExport},
    ];

    // TODO: Add table filtering

    return (
      <Row id="payment-history">
        <Col>
          <h2>Payment history</h2>
          <div className="filters mt-4">
            <span className="filter">
              <p>To:</p>
              <AppDatePicker
                text="To:"
                onChange={(date) => this.handleDateChange(date, "startDate")}
              />
            </span>
            <span className="filter">
              <p>From:</p>
              <AppDatePicker
                text="From:"
                onChange={(date) => this.handleDateChange(date, "endDate")}
              />
            </span>
            <span className="filter sort">
              <p>Filter By:</p>
              <AppDropdown
                options={["All", "Oldest", "Newest"]}
                onSelect={(val) => console.log(val)}
              />
            </span>
          </div>
          <div className="payments mt-3">
            <BootstrapTable
              classes="app-table table-striped"
              keyField="name"
              data={dummyData}
              bordered={false}
              columns={columns}
            />
          </div>
        </Col>
      </Row>
    );
  }
}

export default PaymentHistory;
