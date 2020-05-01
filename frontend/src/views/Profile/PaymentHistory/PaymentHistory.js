import React, {Component} from "react";
import {Col, Button, Row, FormControl, InputGroup} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./PaymentHistory.scss";
import AppDatePicker from "../../../core/components/AppDatePicker/AppDatePicker";
import BootstrapTable from "react-bootstrap-table-next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faDownload} from "@fortawesome/free-solid-svg-icons";

// TODO: Remove dummy data and connect to backend
const dummyData = [
  {name: "Example name 1", amount: 200, ref: "INVO-001", date: "20-04-2020"},
  {name: "Example name 2", amount: 300, ref: "INVO-002", date: "21-04-2020"},
  {name: "Example name 3", amount: 500, ref: "INVO-003", date: "22-04-2020"},
  {name: "Example name 4", amount: 100, ref: "INVO-004", date: "23-04-2020"},
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
      <span className="export" onClick={() => this.handleExport(row)}>
        <FontAwesomeIcon icon={faDownload} />
      </span>
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
      {dataField: "ref", text: "Invoice ref"},
      {dataField: "export", text: "", formatter: this.renderExport},
    ];

    // TODO: Add table filtering

    return (
      <Row id="payment-history">
        <Col>
          <h2>Payment history</h2>
          <div className="filters mt-4">
            <span className="filter">
              <AppDatePicker
                onChange={(date) => this.handleDateChange(date, "startDate")}
              />
            </span>
            <span className="filter">
              <AppDatePicker
                onChange={(date) => this.handleDateChange(date, "endDate")}
              />
            </span>
            <span className="filter search">
              <InputGroup className="search-input mb-3">
                <FormControl
                  placeholder="Search invoice"
                  name="searchQuery"
                  onChange={this.handleChange}
                  onKeyPress={({key}) => {
                    if (key === "Enter") {
                      this.handleSearch();
                    }
                  }}
                />
                <InputGroup.Append>
                  <Button
                    type="submit"
                    onClick={this.handleSearch}
                    variant="outline-primary"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
            </span>
          </div>
          <div className="payments mt-3">
            <BootstrapTable
              classes="app-table"
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
