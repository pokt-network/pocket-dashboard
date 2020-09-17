import React, {Component} from "react";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
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
import moment from "moment";
import PrintableInvoice from "../../Payment/PrintableInvoice/PrintableInvoice";
import ReactToPrint from "react-to-print";

class PaymentHistory extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleDateChange = this.handleDateChange.bind(this);
    this.renderExport = this.renderExport.bind(this);
    this.onTablePagination = this.onTablePagination.bind(this);
    this.paginateAfterDateChange = this.paginateAfterDateChange.bind(this);
    this.handleSearch = this.handleSearch.bind(this)
    this.searchChange = this.searchChange.bind(this)

    this.state = {
      fromDate: "",
      toDate: "",
      paymentID: "",
      input: "",
      history: [],
      offset: 0,
      page: 1,
    };
  }

  async componentDidMount() {
    const userEmail = UserService.getUserInfo().email;
    let history = await PaymentService.getPaymentHistory(
      userEmail, PAYMENT_HISTORY_LIMIT
    );

    history.forEach(obj => {
      obj.formatedAmount = obj.amount / 100;
    });

    this.setState({history});
  }

  renderExport(cell, row) {

    if (row.printableData) {
      this.setState({});
      return (
        <div className="print" style={{
          display: row.printableData !== undefined ? "block" : "none",
          height: "32px"
          }}>

          <ReactToPrint
            trigger={() => (
              <Button className="link">
                <img className="download-invoice" src="/assets/download_invoice.svg" alt="" />
              </Button>
            )}
            content={() => this.componentRef}
            bodyClass="printable-invoice"
            copyStyles={true}
          />
          <PrintableInvoice
          ref={(el) => (this.componentRef = el)}
          invoiceItems={row.printableData.information}
          purchaseDetails={row.printableData.items}
          cardHolderName={row.billingDetails.name}
          poktPrice={row.poktPrice}
          purchasedTokens={row.amount}
          total={row.printableData.total}
        />
        </div>
      );
    }
  }

  handleDateChange(date, name) {
    this.setState(
      {
        [name]: moment(date).format("YYYY-MM-DD"),
        offset: 0,
        page: 1,
      }, this.paginateAfterDateChange
    );
  }

  searchChange({ currentTarget: input }) {
    this.setState(
      {
        input: input.value
      }
    );
  }

  handleSearch() {
    console.log(this.state.input)
    this.setState(
      {
        paymentID: this.state.input,
        offset: 0,
        page: 1,
      }, this.paginateAfterDateChange
    );
  }

  paginateAfterDateChange() {
    this.onTablePagination(undefined, {
      page: 1,
      sizePerPage: PAYMENT_HISTORY_LIMIT,
    });
  }

  async onTablePagination(_, {page, sizePerPage}) {
    const {fromDate, toDate, paymentID} = this.state;

    const userEmail = UserService.getUserInfo().email;
    const offset = (page - 1) * sizePerPage + 1;

    let history = await PaymentService.getPaymentHistory(
      userEmail, PAYMENT_HISTORY_LIMIT, offset, fromDate, toDate, paymentID
    );

    history.forEach(obj => {
      obj.formatedAmount = obj.amount / 100;
    });

    this.setState({page, history, offset});
  }

  render() {
    let {history, page, offset} = this.state;

    history.forEach(obj => {
      obj.formatedAmount = obj.amount / 100;
    });

    const columns = [
      {dataField: "item.name", text: "App/Node name"},
      {
        dataField: "formatedAmount",
        text: "Amount",
        formatter: (cell) => formatCurrency(cell),
      },
      {dataField: "createdDate", text: "Date"},
      {dataField: "paymentID", text: "Invoice ref"},
      {dataField: "export", text: "", formatter: this.renderExport},
    ];

    const pageListRenderer = ({pages, onPageChange}) => {
      // Only include < > when there are pages available
      let {history} = this.state;

      history.forEach(obj => {
        obj.formatedAmount = obj.amount / 100;
      });

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
      <Row id="general" className="payment-history" style={{zIndex: "11111"}}>
        <Col lg={{span: 10, offset: 1}} className="title-page">
          <div className="wrapper">
            <h1>Payment history</h1>
            <div className="filters mt-4">
              <span className="filter">
                <AppDatePicker
                  onChange={(date) => this.handleDateChange(date, "fromDate")}
                />
              </span>
              <p className="label-text">To</p>
              <span className="filter">
                <AppDatePicker
                  onChange={(date) => this.handleDateChange(date, "toDate")}
                />
              </span>
              <span className="filter search">
                <InputGroup className="search-input mb-3">
                  <FormControl
                    placeholder="Search invoice"
                    name="searchQuery"
                    onChange={(e) => {
                      this.searchChange(e);
                    }}
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
