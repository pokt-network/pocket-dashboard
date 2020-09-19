import React, {Component} from "react";
import "../../../core/components/Purchase/Purchase.scss";
import {Col, Row} from "react-bootstrap";
//import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AppSlider from "../../../core/components/AppSlider";
import {ITEM_TYPES, PURCHASE_ITEM_NAME} from "../../../_constants";
//import {STYLING} from "../../../_constants";
import {formatNumbers, scrollToId} from "../../../_helpers";
import PaymentService from "../../../core/services/PocketPaymentService";
import PocketPaymentService from "../../../core/services/PocketPaymentService";
import numeral from "numeral";
import PocketApplicationService from "../../../core/services/PocketApplicationService";
//import {faCaretUp} from "@fortawesome/free-solid-svg-icons";
import AppAlert from "../../../core/components/AppAlert";
import PocketCheckoutService from "../../../core/services/PocketCheckoutService";
import Loader from "../../../core/components/Loader";
import PocketAccountService from "../../../core/services/PocketAccountService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import {isNaN} from "formik";
import AppOrderSummary from "../../../core/components/AppOrderSummary/AppOrderSummary";
import UserService from "../../../core/services/PocketUserService";
import PocketClientService from "../../../core/services/PocketClientService";
import {Configurations} from "../../../_configuration";

const POCKET_NETWORK_CONFIGURATION = Configurations.pocket_network;


class SelectRelays extends Component {
  constructor(props, context) {
    super(props, context);

    this.onSliderChange = this.onSliderChange.bind(this);
    this.onCurrentBalanceChange = this.onCurrentBalanceChange.bind(this);
    this.goToSummary = this.goToSummary.bind(this);

    this.state = {
      upoktToStake: 0,
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
              .then(({upokt, cost}) => {

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
                      total,
                      upoktToStake: upokt
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
      .then(({upokt, cost}) => {
        const subTotal = parseFloat(cost);
        const total = subTotal - currentAccountBalance;

        this.setState({
          currentAccountBalance: currentAccountBalance,
          total,
          subTotal,
          upoktToStake: upokt
        });
      });
  }

  onSliderChange(value) {
    const {currentAccountBalance} = this.state;

    PocketCheckoutService.getApplicationMoneyToSpent(value)
      .then(({upokt, cost}) => {
        const subTotal = parseFloat(cost);
        const total = subTotal - currentAccountBalance;

        this.setState({
          relaysSelected: value,
          subTotal,
          total,
          upoktToStake: upokt
        });
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

    if (subTotal < 0 || isNaN(subTotal)) {
      throw new Error("Relays per day cost must be a positive value.");
    }

    if (total < 0 || isNaN(total)) {
      throw new Error("Total cost must be a positive value.");
    }

    return true;
  }

  async createPaymentIntent(relays, currency, amount, tokens) {
    const {
      id,
      passphrase,
      chains,
      address,
    } = PocketApplicationService.getApplicationInfo();
    const {pocketApplication} = await PocketApplicationService.getApplication(address);

    const item = {
      account: address,
      name: pocketApplication.name,
      maxRelays: relays
    };

    const amountNumber = parseFloat(amount);

    const {success, data: paymentIntentData} = await PocketPaymentService
      .createNewPaymentIntent(ITEM_TYPES.APPLICATION, item, currency, amountNumber, tokens);

    if (!success) {
      throw new Error(paymentIntentData.data.message);
    }

    if (paymentIntentData.provider === "token") {
      const url = _getDashboardPath(DASHBOARD_PATHS.appDetail);
      const detail = url.replace(":id", id);
      const applicationLink = `${window.location.origin}${detail}`;

      const appStakeTransaction = await PocketClientService.appStakeRequest(
        address, passphrase, chains, tokens);

      const gatewayAATSignature = await PocketClientService.signGatewayAAT(
        address, passphrase);

      const stakeInformation = {
        applicationId: id,
        appStakeTransaction,
        paymentId: paymentIntentData.id,
        applicationLink,
        gatewayAATSignature,
      };

      await PocketApplicationService.stakeApplication(stakeInformation);
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
      upoktToStake
    } = this.state;

    this.setState({loading: true});

    // At the moment the only available currency is USD.
    const currency = currencies[0];

    try {
      this.validate(currency);

      // Avoiding floating point precision errors.
      const subTotalAmount = parseFloat(numeral(subTotal).format("0.00")).toFixed(2);
      const totalAmount = parseFloat(numeral(total).format("0.00")).toFixed(2);

      const {data: paymentIntentData} = await this.createPaymentIntent(relaysSelected, currency, totalAmount, currentAccountBalance);

      PaymentService.savePurchaseInfoInCache({relays: parseInt(relaysSelected), costPerRelay: parseFloat(totalAmount)});

      if (total === 0) {
        const user = UserService.getUserInfo().email;

        // eslint-disable-next-line react/prop-types
        this.props.history.replace({
          pathname: _getDashboardPath(DASHBOARD_PATHS.invoice),
          state: {
            type: ITEM_TYPES.NODE,
            paymentId: paymentIntentData.id,
            paymentMethod: {
              holder: user,
              method: "POKT Tokens"
            },
            details: [
              {value: relaysSelected, text: PURCHASE_ITEM_NAME.APPS, format: false},
              {value: subTotalAmount, text: `${PURCHASE_ITEM_NAME.APPS} cost`, format: true},
            ],
            total,
            currentAccountBalance,
            upoktToStake
          },
        });
      } else {
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
            currentAccountBalance,
            upoktToStake
          },
        });
      }
    } catch (e) {
      this.setState({
        error: {show: true, message: <h4>{e.toString()}</h4>},
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
      upoktToStake
    } = this.state;

    // At the moment the only available currency is USD.
    const currency = currencies[0];
    const subTotalFixed = numeral(subTotal).format("$0,0.00");
    const totalFixed = numeral(total).format("$0,0.00");

    if (loading) {
      return <Loader />;
    }

    return (
      <div id="purchase">
        <Row>
          <Col className="title-page">
            {error.show && (
              <AppAlert
                variant="danger"
                title={error.message}
                dismissible
                onClose={() => this.setState({error: false})}
              />
            )}
            <h1>Stake and scale</h1>
            <p className="subtitle">
              With the Stake and Scale, you only need to pay for the API throughput
              you application needs. If you expect your application to grow in
              the short term, we recommend giving it a buffer.
            </p>
          </Col>
        </Row>
        <Row>
          <Col sm="7" className="relays-column">
            <h2>
              Slide to select how many relays per day to purchase
            </h2>
            <div className="slider-wrapper">
              <AppSlider
                defaultValue={minRelays}
                onChange={this.onSliderChange}
                type={PURCHASE_ITEM_NAME.APPS}
                marks={{
                  [minRelays]: `${formatNumbers(minRelays)} RPD`,
                  // [maxRelays / 2]: {
                  //   label: (
                  //     <div className="average-stake-wrapper">
                  //       <FontAwesomeIcon
                  //         style={{color: STYLING.primaryColor}}
                  //         icon={faCaretUp}
                  //       />
                  //       <span style={{fontSize: "0.75rem"}}>AVRG STAKE</span>
                  //     </div>
                  //   ),
                  // },
                  [maxRelays]: `*${formatNumbers(maxRelays)} RPD*`,
                }}
                step={POCKET_NETWORK_CONFIGURATION.max_sessions}
                min={minRelays}
                max={maxRelays}
              />
            </div>
            <AppAlert
              className="max-alert"
              variant="primary"
              title={<h4 className="alert-max">About RPD, Relays per day:</h4>}
            >
              <p className="alert-max">
                Each RPD purchased on the Pocket Dashboard has a representation as a POKT token on the Pocket Network. Approx. 40 RPD = 1 POKT.
              </p>
              <br />
              <p className="alert-max">
                *Need More Relays per Day? If you&apos;re interested in more relays beyond the maximum on the dashboard, <br />
                please <a href="mailto:dashboard@pokt.network">contact us</a> to find a solution specially designed for your app.
              </p>
            </AppAlert>
          </Col>
          <Col sm="5" className="order-summary-column">
            <h2>Order Summary</h2>
            <AppOrderSummary
              items={[
                {label: "App", quantity: 1},
                {label: PURCHASE_ITEM_NAME.APPS, quantity: formatNumbers(relaysSelected)},
                {
                  label: `${PURCHASE_ITEM_NAME.APPS} Cost`,
                  quantity: `${subTotalFixed} ${currency.toUpperCase()}`,
                },
              ]}
              balance={currentAccountBalance}
              balanceOnChange={this.onCurrentBalanceChange}
              total={totalFixed}
              loading={loading}
              upoktToStake={upoktToStake}
              formActionHandler={this.goToSummary}
              // At the moment, we're only using  USD
              currency={currencies[0]}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default SelectRelays;
