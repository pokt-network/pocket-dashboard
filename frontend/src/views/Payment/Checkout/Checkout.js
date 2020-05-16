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
import UnauthorizedAlert from "../../../core/components/UnauthorizedAlert";
import Loader from "../../../core/components/Loader";

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
      unauthorized: false,
    };
  }

  async componentDidMount() {
    this.setState({loading: true});
    if (this.props.location.state === undefined) {
      this.setState({loading: false, unauthorized: true});
      return;
    }

    const {type, paymentId, paymentMethod, detail} = this.props.location.state;
    const address =
      type === ITEM_TYPES.APPLICATION
        ? ApplicationService.getApplicationInfo().address
        : NodeService.getNodeInfo().address;
    const {
      paymentID: id,
      createdDate: date,
      item,
      amount: total,
    } = await PaymentService.getPaymentDetail(paymentId);

    const {type: brand, digits} = paymentMethod.cardData;

    const invoice = {
      id,
      date: moment(date).format("DD MM YYYY"),
      owner: item.account,
      card: `${brand.charAt(0).toUpperCase() + brand.slice(1)} ${digits}`,
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
    const {
      detail,
      total: totalCost,
      type,
      address,
      loading,
      unauthorized,
    } = this.state;
    const isApp = type === ITEM_TYPES.APPLICATION;

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

    if (unauthorized) {
      return <UnauthorizedAlert />;
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
          variant="primary"
          className="mt-3  pl-4 pr-4 float-right font-weight-light"
        >
          Go to {isApp ? "app" : "nodes"} detail
        </Button>
      </Link>
    );

    /* eslint-disable jsx-a11y/alt-text */
    const icons = [
      <img key={0} src="/assets/cart.svg" className="step-icon" />,
      <img key={1} src="/assets/arrows.svg" className="step-icon" />,
      <img key={2} src="/assets/check.svg" className="step-icon" />,
    ];

    if (unauthorized) {
    }

    return (
      <div id="nodes-checkout" className="mb-5">
        <Row className="segment mb-3">
          <Col className="title-page">
            {detailButton}
            <h2>Enjoy your purchase</h2>
            <p>Please wait a few minutes until the process is completed</p>
            <AppSteps
              icons={icons}
              current={2}
              steps={[
                "Purchase",
                "Encode and sign stake transaction",
                "throughput available",
              ]}
            />
          </Col>
        </Row>
        <div className="mt-4 mb-4 title-page">
          <h3>Your invoice</h3>
        </div>
        <Row className="segment mb-2">
          <Invoice
            title={`Invoice ${id}`}
            information={information}
            items={items}
            total={total}
          />
        </Row>
        <p className="mt-4 ml-3 font-weight-light">
          {/* TODO: Add print functionality */}
          <Button variant="link" className="print font-weight-light">
            Print
          </Button>{" "}
          your invoice
        </p>
      </div>
    );
  }
}

export default Checkout;
