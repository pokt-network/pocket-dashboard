import React, {Component} from "react";
import "./SelectRelays.scss";
import {Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AppSlider from "../../../core/components/AppSlider";
import {ITEM_TYPES, PURCHASE_ITEM_NAME, STYLING} from "../../../_constants";
import {formatNumbers, scrollToId} from "../../../_helpers";
import PaymentService from "../../../core/services/PocketPaymentService";
import PocketPaymentService from "../../../core/services/PocketPaymentService";
import numeral from "numeral";
import PocketApplicationService from "../../../core/services/PocketApplicationService";
import {faCaretUp} from "@fortawesome/free-solid-svg-icons";
import AppAlert from "../../../core/components/AppAlert";
import PocketCheckoutService from "../../../core/services/PocketCheckoutService";
import Loader from "../../../core/components/Loader";
import PocketAccountService from "../../../core/services/PocketAccountService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {isNaN} from "formik";
import AppOrderSummary from "../../../core/components/AppOrderSummary/AppOrderSummary";

class SelectRelays extends Component {
  constructor(props, context) {
    super(props, context);

    this.onSliderChange = this.onSliderChange.bind(this);
    this.onCurrentBalanceChange = this.onCurrentBalanceChange.bind(this);
    this.goToSummary = this.goToSummary.bind(this);

    this.state = {
      minRelays: 0,
      maxRelays: 0,
      relaysSelected: 0,
      total: 0,
      subTotal: 0,
      originalAccountBalance: 0,
      currentAccountBalance: 0,
      currencies: [],
      loading: true,
      error: {show: false, message: ""},
    };
  }

  componentDidMount() {
    const {address: accountAddress} = PocketApplicationService.getApplicationInfo();

    PaymentService.getAvailableCurrencies()
      .then(currencies => {

        PocketCheckoutService.getRelaysPerDay()
          .then(relaysPerDay => {
            const minRelays = parseInt(relaysPerDay.min);

            PocketCheckoutService.getApplicationMoneyToSpent(minRelays)
              .then(({cost}) => {

                PocketAccountService.getBalance(accountAddress)
                  .then(({balance}) => {
                    const currentAccountBalance = parseFloat(balance);
                    const subTotal = parseFloat(cost);
                    const total = subTotal - currentAccountBalance;

                    this.setState({
                      currentAccountBalance: currentAccountBalance,
                      originalAccountBalance: currentAccountBalance,
                      minRelays: minRelays,
                      maxRelays: parseInt(relaysPerDay.max),
                      loading: false,
                      relaysSelected: minRelays,
                      subTotal,
                      total
                    });
                  });
              });
          });

        this.setState({currencies});
      });
  }

  onCurrentBalanceChange(e) {
    let {relaysSelected} = this.state;
    const {
      target: {value},
    } = e;
    const currentAccountBalance = parseFloat(value);

    PocketCheckoutService.getApplicationMoneyToSpent(relaysSelected)
      .then(({cost}) => {
        const subTotal = parseFloat(cost);
        const total = subTotal - currentAccountBalance;

        this.setState({
          currentAccountBalance: currentAccountBalance,
          total,
          subTotal,
        });
      });
  }

  onSliderChange(value) {
    const {currentAccountBalance} = this.state;

    PocketCheckoutService.getApplicationMoneyToSpent(value)
      .then(({cost}) => {
        const subTotal = parseFloat(cost);
        const total = subTotal - currentAccountBalance;

        this.setState({relaysSelected: value, subTotal, total});
      });
  }

  validate(currency) {
    const {
      minRelays,
      maxRelays,
      relaysSelected,
      subTotal,
      total,
      currentAccountBalance,
      originalAccountBalance,
    } = this.state;

    if (relaysSelected < minRelays || relaysSelected > maxRelays) {
      throw new Error("Relays per days is not in range allowed.");
    }

    if (currentAccountBalance < 0) {
      throw new Error("Current balance cannot be minor than 0.");
    }

    if (currentAccountBalance > originalAccountBalance) {
      throw new Error(`Current balance cannot be greater than ${originalAccountBalance} ${currency}.`);
    }

    if (subTotal <= 0 || isNaN(subTotal)) {
      throw new Error("Relays per day cost must be a positive value.");
    }

    if (total <= 0 || isNaN(total)) {
      throw new Error("Total Cost must be a positive value.");
    }

    return true;
  }

  async createPaymentIntent(relays, currency, amount) {
    const {address} = PocketApplicationService.getApplicationInfo();
    const {pocketApplication} = await PocketApplicationService.getApplication(address);

    const item = {
      account: address,
      name: pocketApplication.name,
      maxRelays: relays
    };

    const {success, data: paymentIntentData} = await PocketPaymentService
      .createNewPaymentIntent(ITEM_TYPES.APPLICATION, item, currency, parseFloat(amount));

    if (!success) {
      throw new Error(paymentIntentData.data.message);
    }

    return {success, data: paymentIntentData};
  }

  async goToSummary() {
    const {
      relaysSelected,
      currencies,
      subTotal,
      total,
      currentAccountBalance,
    } = this.state;

    this.setState({loading: true});

    // At the moment the only available currency is USD.
    const currency = currencies[0];

    try {
      this.validate(currency);

      // Avoiding floating point precision errors.
      const subTotalAmount = parseFloat(numeral(subTotal).format("0.000")).toFixed(3);
      const totalAmount = parseFloat(numeral(total).format("0.000")).toFixed(3);

      const {data: paymentIntentData} = await this.createPaymentIntent(relaysSelected, currency, totalAmount);

      PaymentService.savePurchaseInfoInCache({relays: parseInt(relaysSelected), costPerRelay: parseFloat(totalAmount)});

      // eslint-disable-next-line react/prop-types
      this.props.history.push({
        pathname: _getDashboardPath(DASHBOARD_PATHS.orderSummary),
        state: {
          type: ITEM_TYPES.APPLICATION,
          paymentIntent: paymentIntentData,
          quantity: {
            number: relaysSelected,
            description: PURCHASE_ITEM_NAME.APPS,
          },
          cost: {
            number: subTotalAmount,
            description: `${PURCHASE_ITEM_NAME.APPS} cost`,
          },
          total: totalAmount,
          currentAccountBalance
        },
      });
    } catch (e) {
      this.setState({
        error: {show: true, message: e.toString()},
        loading: false,
      });
      scrollToId("alert");
    }
  }

  render() {
    const {
      error,
      currencies,
      relaysSelected,
      subTotal,
      total,
      minRelays,
      maxRelays,
      currentAccountBalance,
      loading,
    } = this.state;

    // At the moment the only available currency is USD.
    const currency = currencies[0];
    const subTotalFixed = numeral(subTotal).format("$0,0.000");
    const totalFixed = numeral(total-currentAccountBalance).format("$0,0.000");

    if (loading) {
      return <Loader />;
    }

    return (
      <div id="select-relays">
        <Row className="mt-4 mb-4">
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
            <p className="subtitle">
              With the custom tier, you only need to pay for the API throughput
              you application needs. If you expect your application to grow in
              the short term, we recommend giving it a small buffer.
            </p>
          </Col>
        </Row>
        <Row>
          <Col sm="7" className="title-page">
            <h2 className="mb-5">
              Slide to Select how much relays per day you want to buy
            </h2>
            <div className="relays-calc">
              <div className="slider-wrapper">
                <AppSlider
                  defaultValue={minRelays}
                  onChange={this.onSliderChange}
                  type={PURCHASE_ITEM_NAME.APPS}
                  marks={{
                    [minRelays]: `${minRelays} RPD`,
                    [maxRelays / 2]: {
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
                    [maxRelays]: `*${formatNumbers(maxRelays)} RPD`,
                  }}
                  min={minRelays}
                  max={maxRelays}
                />
              </div>
            </div>
            <AppAlert
              className="pt-4 pb-4"
              variant="primary"
              title={<h4 className="alert-relays">*More relays?</h4>}
            >
              <p className="alert-relays">
                If your app requires more than {formatNumbers(maxRelays)} Relays
                Per Day please <a href="/todo">Contact us</a> directly to find a
                solution specially designed for your app.
              </p>
            </AppAlert>
          </Col>
          <Col sm="5" className="pr-5 title-page">
            <h2 className="mb-4">Order Summary</h2>
            <AppOrderSummary
              items={[
                {label: "App", quantity: 1},
                {label: PURCHASE_ITEM_NAME.APPS, quantity: relaysSelected},
                {
                  label: `${PURCHASE_ITEM_NAME.APPS} cost`,
                  quantity: `${subTotalFixed} ${currency.toUpperCase()}`,
                },
              ]}
              balance={currentAccountBalance}
              balanceOnChange={this.onCurrentBalanceChange}
              total={totalFixed}
              loading={loading}
              formActionHandler={this.goToSummary}
            />
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
