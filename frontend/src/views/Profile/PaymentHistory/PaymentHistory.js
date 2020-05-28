import React, {Component} from "react";
import {Col, Button, Row, FormControl, InputGroup} from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import "./PaymentHistory.scss";
import AppDatePicker from "../../../core/components/AppDatePicker/AppDatePicker";
import BootstrapTable from "react-bootstrap-table-next";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import UserService from "../../../core/services/PocketUserService";
import PaymentService from "../../../core/services/PocketPaymentService";
import {PAYMENT_HISTORY_LIMIT} from "../../../_constants";
import {formatCurrency} from "../../../_helpers";
import paginationFactory from "react-bootstrap-table2-paginator";

class PaymentHistory extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.renderExport = this.renderExport.bind(this);
    this.handleExport = this.handleExport.bind(this);
    this.onTablePagination = this.onTablePagination.bind(this);

    this.state = {
      startDate: new Date(),
      endDate: new Date(),
      history: [],
      offset: 0,
      page: 1,
    };
  }

  async componentDidMount() {
    const userEmail = UserService.getUserInfo().email;
    const history = await PaymentService.getPaymentHistory(
      userEmail, PAYMENT_HISTORY_LIMIT
    );

    this.setState({history});
  }

  handleExport(data) {
    // TODO: Add export to downloadable file functionality
    console.log(data);
  }

  renderExport(cell, row) {
    return (
      <span className="export" onClick={() => this.handleExport(row)}>
        <img src="/assets/download_invoice.svg" alt="" />
      </span>
    );
  }

  handleDateChange(date, name) {
    this.setState({[name]: date});
  }

  async onTablePagination(_, {page, sizePerPage}) {
    const userEmail = UserService.getUserInfo().email;
    const offset = (page - 1) * sizePerPage + 1;

    const history = await PaymentService.getPaymentHistory(
      userEmail, PAYMENT_HISTORY_LIMIT, offset
    );

    this.setState({page, history, offset});
  }

  render() {
    const {history, page, offset} = this.state;

    const columns = [
      {dataField: "item.name", text: "App/Node name"},
      {
        dataField: "amount",
        text: "Amount",
        formatter: (cell) => formatCurrency(cell),
      },
      {dataField: "createdDate", text: "Date"},
      {dataField: "paymentID", text: "Invoice ref"},
      {dataField: "export", text: "", formatter: this.renderExport},
    ];

    const pageListRenderer = ({pages, onPageChange}) => {
      // Only include < > when there are pages available
      const {history} = this.state;

      const hasPagesAvailable = history.length === PAYMENT_HISTORY_LIMIT;
      const isAnIcon = (p) =>
        typeof p.page === "string" && p.page !== ">>" && p.page !== "<<";
      const pageWithoutIndication = pages.filter((p) => {
        const isIcon = isAnIcon(p);

        // Only return > when there are pages available.
        if (isIcon) {
          if (p.page === "<") {
            return true;
          } else {
            return hasPagesAvailable;
          }
        }
        return false;
      });

      return (
        <div>
          {pageWithoutIndication.map((p, idx) => (
            <Button
              key={idx}
              variant="primary"
              onClick={() => onPageChange(p.page)}
            >
              {p.page}
            </Button>
          ))}
        </div>
      );
    };

    const PaginationOptions = {
      page: page,
      sizePerPage: PAYMENT_HISTORY_LIMIT,
      hideSizePerPage: true,
      totalSize: page * offset + PAYMENT_HISTORY_LIMIT + 1,
      pageListRenderer,
    };

    // TODO: Add table date filtering

    return (
      <Row id="general" className="payment-history">
        <Col lg={{span: 10, offset: 1}} className="title-page">
          <div className="wrapper">
            <h1>Payment history</h1>
            <div className="filters mt-4">
              <span className="filter">
                <AppDatePicker
                  onChange={(date) => this.handleDateChange(date, "startDate")}
                />
              </span>
              <p className="label-text">To</p>
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
                remote
                classes="app-table"
                keyField="paymentID"
                data={history}
                bordered={false}
                columns={columns}
                pagination={paginationFactory(PaginationOptions)}
                onTableChange={this.onTablePagination}
              />
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default PaymentHistory;
