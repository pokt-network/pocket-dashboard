/* eslint-disable react/prop-types */
import React, {Component} from "react";
import "./Checkout.scss";
import {Button, Col, Row} from "react-bootstrap";
import AppSteps from "../../../core/components/AppSteps/AppSteps";
import Invoice from "./Invoice";
import {formatCurrency} from "../../../_helpers";
import PaymentService from "../../../core/services/PocketPaymentService";
import moment from "moment";
import {ITEM_TYPES} from "../../../_constants";
import ApplicationService from "../../../core/services/PocketApplicationService";
import NodeService from "../../../core/services/PocketNodeService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {Link} from "react-router-dom";
import Loader from "react-spinners/DotLoader";

class Checkout extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      loading: false,
      type: "",
      invoice: {
        owner: "",
        id: "",
        date: "",
        card: "",
      },
      detail: [],
      total: 0,
      address: "",
    };
  }

  async componentDidMount() {
    this.setState({loading: true});
    if (this.props.location.state === undefined) {
      // TODO: Show message on frontend
      console.log("Error: you are not authorized to do this action");
      return;
    }

    const {type, paymentId, paymentMethod, detail} = this.props.location.state;
    const address =
      type === ITEM_TYPES.APPLICATION
        ? ApplicationService.getAppAInfo().address
        : NodeService.getNodeInfo().address;
    const {
      paymentID: id,
      createdDate: date,
      item,
      amount: total,
    } = await PaymentService.getPaymentDetail(paymentId);

    const invoice = {
      id,
      date: moment(date).format("DD MM YYYY"),
      owner: item.account,
      card: `${paymentMethod.brand} **** **** **** ${paymentMethod.lastDigits}`,
    };

    this.setState({
      loading: false,
      type,
      address,
      invoice,
      total,
      detail,
      paymentMethod,
    });
  }
  render() {
    const {owner, id, date, card} = this.state.invoice;
    const {detail, total: totalCost, type, address, loading} = this.state;
    const isApp = type === ITEM_TYPES.APPLICATION;

    // TODO: Remove dummy data when integrating with backend.
    const information = [
      {text: "Date", value: date},
      {text: "Bill To", value: owner},
      {text: "Invoice", value: id},
      {text: "Card Detail", value: card},
    ];

    const items = [
      ...detail,
      // TODO: Get balance
      {text: "Balance", value: 1500},
    ].map((it) => {
      return {text: it.text, value: formatCurrency(it.value)};
    });

    const total = formatCurrency(totalCost);

    if (loading) {
      return <Loader />;
    }

    const detailButton = (
      <Link
        to={() => {
          const route = isApp
            ? DASHBOARD_PATHS.appDetail
            : DASHBOARD_PATHS.nodeDetail;
          const url = _getDashboardPath(route);

          return url.replace(":address", address);
        }}
      >
        <Button
          variant="dark pl-4"
          className="mt-3 pr-4 float-right font-weight-bold"
        >
          Go to {isApp ? "apps" : "nodes"} detail
        </Button>
      </Link>
    );

    return (
      <div id="nodes-checkout">
        <Row className="segment mb-3">
          <Col>
            <h2>Enjoy your purchase</h2>
            <p>Please wait a few minutes until the process is completed</p>
            <AppSteps
              current={1}
              steps={[
                "Purchase",
                "Encode and sign stake",
                "Successfull Node stake",
              ]}
            />
            {detailButton}
          </Col>
        </Row>
        <Row className="segment mb-2">
          <Invoice
            title={`Invoice ${id}`}
            information={information}
            items={items}
            total={total}
          />
        </Row>
        <Button
          variant="dark pl-4"
          className="mt-3 mb-5 mr-3 pr-5 pl-5 float-right font-weight-bold"
        >
          {/* TODO: Add invoice print functionality */}
          Print
        </Button>
      </div>
    );
  }
}

export default Checkout;
