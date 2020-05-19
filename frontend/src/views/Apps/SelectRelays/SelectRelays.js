import React, {Component} from "react";
import "./SelectRelays.scss";
import {Col, Form, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AppSlider from "../../../core/components/AppSlider";
import {ITEM_TYPES, MAX_RELAYS, STYLING} from "../../../_constants";
import {formatCurrency, formatNumbers, scrollToId} from "../../../_helpers";
import PaymentService from "../../../core/services/PocketPaymentService";
import numeral from "numeral";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import StripePaymentService from "../../../core/services/PocketStripePaymentService";
import LoadingButton from "../../../core/components/LoadingButton";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons";
import AppAlert from "../../../core/components/AppAlert";

class SelectRelays extends Component {
  constructor(props, context) {
    super(props, context);

    this.onSliderChange = this.onSliderChange.bind(this);
    this.goToCheckout = this.goToCheckout.bind(this);

    this.state = {
      relays: 1,
      poktPrice: 0.06,
      total: 0,
      currencies: [],
      loading: false,
      error: {show: false, message: ""},
    };
  }

  async componentDidMount() {
    const currencies = await PaymentService.getAvailableCurrencies();

    this.setState({currencies});
  }

  onSliderChange(value) {
    const {poktPrice} = this.state;

    this.setState({relays: value, total: value * poktPrice});
  }

  async createPaymentIntent(amount, currency, pokt) {
    const item = {
      account: UserService.getUserInfo().email,
      name: ApplicationService.getApplicationInfo().data.name,
      pokt,
    };

    const {success, data} = await StripePaymentService.createNewPaymentIntent(
      ITEM_TYPES.APPLICATION, item, currency, amount
    );

    return {success, data};
  }

  async goToCheckout() {
    this.setState({loading: true});
    const {relays, poktPrice, currencies, total: totalPrice} = this.state;

    // At the moment the only available currency is USD.
    const usd = currencies[0];

    // Avoiding floating point precision errors.
    const total = parseFloat(numeral(totalPrice).format("0.00")).toFixed(2);

    // TODO: Calculate pokt from formula
    const {success, data: paymentIntentData} = await this.createPaymentIntent(
      total, usd, relays
    );

    if (!success) {
      this.setState({
        error: {show: true, message: paymentIntentData.data.message},
        loading: false,
      });
      scrollToId("alert");
      return;
    }

    PaymentService.savePurchaseInfoInCache({relays, costPerRelay: total});

    // eslint-disable-next-line react/prop-types
    this.props.history.push({
      pathname: _getDashboardPath(DASHBOARD_PATHS.appOrderSummary),
      state: {
        type: ITEM_TYPES.APPLICATION,
        paymentIntent: paymentIntentData,
        quantity: {number: relays, description: "Relays per session"},
        cost: {number: poktPrice, description: "replays per session cost"},
        total: total,
      },
    });
  }

  render() {
    const {error, relays, poktPrice, total: currentTotal, loading} = this.state;

    const total = formatCurrency(currentTotal);

    return (
      <div id="select-relays">
        <Row className="mt-4 mb-5">
          <Col lg="11" md="11" sm="11" className="title-page">
            {error.show && (
              <AppAlert
                variant="danger"
                title={error.message}
                dismissible
                onClose={() => this.setState({error: false})}
              />
            )}
            <h1>Custom tier</h1>
            <p>
              With the custom tier, you only need to pay for the API throughput
              you application needs. If you expect your application to grow in
              the short term, we recommend giving it a small buffer.
            </p>
          </Col>
        </Row>
        <Row>
          <Col lg="8" md="8" sm="8" className="title-page">
            <h4>Slide to Select how much relays per day you want to buy</h4>
            <div className="relays-calc">
              <div className="slider-wrapper">
                <AppSlider
                  onChange={this.onSliderChange}
                  marks={{
                    1: "1 RPD",
                    [MAX_RELAYS / 2]: {
                      label: (
                        <span>
                          <FontAwesomeIcon
                            style={{color: STYLING.primaryColor}}
                            icon={faCaretUp}
                          />
                          <p style={{fontSize: "0.9em"}}>AVG STAKE</p>
                        </span>
                      ),
                    },
                    [MAX_RELAYS]: `*${formatNumbers(MAX_RELAYS)} RPD`,
                  }}
                  min={1}
                  max={MAX_RELAYS}
                />
              </div>
            </div>
            <AppAlert
              className="pt-4 pb-4"
              variant="primary"
              title={<h4 className="alert-relays">*More relays?</h4>}
            >
              <p className="alert-relays">
                If your app requires more than {formatNumbers(MAX_RELAYS)}{" "}
                Relays Per Day please <a href="/todo">Contact us</a> directly to
                find a solution specially designed for your app.
              </p>
            </AppAlert>
          </Col>
          <Col lg="4" md="4" sm="4" className="title-page">
            <h4 className="mb-4">Order Summary</h4>
            <div className="summary">
              <div className="item">
                <p>App</p>
                <p>1</p>
              </div>
              <div className="item">
                <p>Relays per day</p>
                <p>{relays}</p>
              </div>
              <div className="item">
                <p>Relays per day cost</p>
                <p>{poktPrice} USD</p>
              </div>
              <div className="item">
                <p>Current balance</p>
                {/* TODO: Get balance */}
                <Form.Control value="50 USD" readOnly />
              </div>
              <hr />
              <div className="item total">
                <p>Total cost</p>
                <p>{total} USD</p>
              </div>
              <LoadingButton
                loading={loading}
                buttonProps={{
                  onClick: this.goToCheckout,
                  variant: "primary",
                }}
              >
                Checkout
              </LoadingButton>
            </div>
          </Col>
        </Row>
        <Row>
          <Col></Col>
        </Row>
      </div>
    );
  }
}

export default SelectRelays;
