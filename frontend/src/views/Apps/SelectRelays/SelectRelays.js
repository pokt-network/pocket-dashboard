import React, {Component} from "react";
import "./SelectRelays.scss";
import {Alert, Button, Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faExclamationCircle} from "@fortawesome/free-solid-svg-icons";
import AppSlider from "../../../core/components/AppSlider";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {MAX_RELAYS, ITEM_TYPES} from "../../../_constants";
import {formatCurrency} from "../../../_helpers";
import PaymentService from "../../../core/services/PocketPaymentService";
import numeral from "numeral";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import StripePaymentService from "../../../core/services/PocketStripePaymentService";

class SelectRelays extends Component {
  constructor(props, context) {
    super(props, context);

    this.onSliderChange = this.onSliderChange.bind(this);
    this.goToCheckout = this.goToCheckout.bind(this);

    this.state = {
      alert: true,
      relays: 1,
      poktPrice: 0.06,
      total: 0,
      currencies: [],
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
      name: ApplicationService.getAppAInfo().data.name,
      pokt,
    };

    const {success, data} = await StripePaymentService.createNewPaymentIntent(
      ITEM_TYPES.APPLICATION, item, currency, amount);

    return {success, data};
  }

  async goToCheckout() {
    const {relays, currencies, total: totalPrice} = this.state;

    // At the moment the only available currency is USD.
    const usd = currencies[0];

    // Avoiding floating point precision errors.
    const total = parseFloat(numeral(totalPrice).format("0.00"));

    // TODO: Calculate pokt from formula
    const {success, data: paymentIntentData} = await this.createPaymentIntent(
      total, usd, relays);

    if (!success) {
      // TODO: Display message on frontend
      console.log(success, paymentIntentData);
      return;
    }
    console.log(success, paymentIntentData);

    PaymentService.savePurchaseInfoInCache({relays, costPerRelay: total});

    // eslint-disable-next-line react/prop-types
    this.props.history.push({
      pathname: _getDashboardPath(DASHBOARD_PATHS.appOrderSummary),
      state: {
        type: "application",
        paymentIntent: paymentIntentData,
        quantity: 0,
        total: 0,
      },
    });
  }

  render() {
    const {alert, relays, poktPrice, total: currentTotal} = this.state;

    const total = formatCurrency(currentTotal);

    return (
      <div id="select-relays">
        <Row className="mt-4 mb-5">
          <Col>
            <h2>Custom tier</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              varius quam id arcu consectetur, et accumsan libero condimentum.
              Sed aliquet ante a massa mattis malesuada. Morbi aliquet augue
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Select how much relays per session your app will need</h2>
            <div className="price-card">
              <p className="price">US ${poktPrice}</p>
              <p className="label font-weight-bold">POKT market price</p>
            </div>
            <div className="price-card">
              <p className="price">340 POKT US $70</p>
              <p className="label font-weight-bold">Current Balance</p>
            </div>

            {
              /*eslint-disable-next-line jsx-a11y/anchor-is-valid*/
              <a className="link font-weight-bold mt-4 float-right" href="#">
                Calcule your app needs
              </a>
            }
          </Col>
        </Row>
        <Row>
          <Col>
            <div className="relays-calc">
              <div className="slider-wrapper">
                <AppSlider
                  onChange={this.onSliderChange}
                  marks={{1: "1", [MAX_RELAYS]: MAX_RELAYS}}
                  min={1}
                  max={MAX_RELAYS}
                />
              </div>
              <div>
                <InfoCard
                  className="pr-4 pl-4 text-center"
                  title={relays}
                  subtitle="Relays per session"
                >
                  <span />
                </InfoCard>
                <InfoCard
                  className="text-center"
                  title={total}
                  subtitle="Total  amount"
                >
                  <span />
                </InfoCard>
                <InfoCard
                  className="text-center"
                  title={poktPrice}
                  subtitle="Relays per session cost"
                >
                  <span />
                </InfoCard>
              </div>
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <Button
              onClick={this.goToCheckout}
              variant="dark"
              className="mt-3 pl-5 pr-5 font-weight-bold float-right"
            >
              Checkout
            </Button>
          </Col>
        </Row>
        {alert && (
          <Row className="mt-3">
            <Col>
              <Alert
                variant="secondary"
                className="d-flex align-items-center"
                onClose={() => {
                  this.setState({alert: false});
                }}
                dismissible
              >
                <FontAwesomeIcon
                  icon={faExclamationCircle}
                  size="3x"
                  className="icon mr-2"
                />
                Over 20,000 relays per session you please contact us.
              </Alert>
            </Col>
          </Row>
        )}
      </div>
    );
  }
}

export default SelectRelays;
