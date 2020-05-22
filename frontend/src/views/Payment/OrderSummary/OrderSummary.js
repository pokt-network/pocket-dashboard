/* eslint-disable react/prop-types */
import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import CardDisplay from "../../../core/components/Payment/CardDisplay/CardDisplay";
import UserService from "../../../core/services/PocketUserService";
import PaymentService from "../../../core/services/PocketPaymentService";
import "./OrderSummary.scss";
import Loader from "../../../core/components/Loader";
import {ElementsConsumer} from "@stripe/react-stripe-js";
import PaymentContainer from "../../../core/components/Payment/Stripe/PaymentContainer";
import StripePaymentService from "../../../core/services/PocketStripePaymentService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import NewCardNoAddressForm from "../../../core/components/Payment/Stripe/NewCardNoAddressForm";
import AppAlert from "../../../core/components/AppAlert";
import UnauthorizedAlert from "../../../core/components/UnauthorizedAlert";
import {Link} from "react-router-dom";
import {scrollToId} from "../../../_helpers";
import ApplicationService from "../../../core/services/PocketApplicationService";

class OrderSummary extends Component {
  constructor(props, context) {
    super(props, context);

    this.makePurchaseWithSavedCard = this.makePurchaseWithSavedCard.bind(this);
    this.saveNewCardNoAddress = this.saveNewCardNoAddress.bind(this);
    this.goToInvoice = this.goToInvoice.bind(this);

    this.state = {
      type: "",
      paymentIntent: {},
      quantity: {
        number: 0,
        description: "",
      },
      total: 0,
      cost: {
        number: 0,
        description: "",
      },
      balance: 50,
      paymentMethods: [],
      selectedPaymentMethod: {},
      loading: false,
      loadingPayment: false,
      agreeTerms: false,
      alert: {
        show: false,
        variant: "",
        message: "",
      },
      unauthorized: false,
    };
  }

  async componentDidMount() {
    this.setState({loading: true});
    // eslint-disable-next-line react/prop-types
    if (this.props.location.state === undefined) {
      this.setState({loading: false, unauthorized: true});
      return;
    }

    const {
      type,
      paymentIntent,
      quantity,
      total,
      cost,
    } = this.props.location.state;

    const user = UserService.getUserInfo().email;
    const paymentMethods = await PaymentService.getPaymentMethods(user);

    this.setState({
      loading: false,
      paymentMethods,
      type,
      paymentIntent,
      selectedPaymentMethod: paymentMethods[0],
      quantity,
      total,
      cost,
    });
  }

  goToInvoice() {
    const {
      paymentIntent,
      type,
      selectedPaymentMethod,
      quantity,
      cost,
    } = this.state;

    return this.props.history.replace({
      pathname: _getDashboardPath(DASHBOARD_PATHS.nodesCheckout),
      state: {
        type,
        paymentId: paymentIntent.id,
        paymentMethod: selectedPaymentMethod,
        detail: [
          {value: quantity.number, text: quantity.description},
          {value: cost.number, text: cost.description},
        ],
      },
    });
  }

  async makePurchaseWithSavedCard(e, stripe) {
    e.preventDefault();

    const {paymentIntent, selectedPaymentMethod} = this.state;

    const result = await StripePaymentService.confirmPaymentWithSavedCard(
      // eslint-disable-next-line function-call-argument-newline
      stripe, paymentIntent.paymentNumber, selectedPaymentMethod.id,
      selectedPaymentMethod.billingDetails
    );

    if (result.error) {
      this.setState({
        alert: {
          show: true,
          variant: "warning",
          message: <h4>{result.error.message}</h4>,
        },
      });
      scrollToId("alert");
      return;
    }

    // Stake application
    // TODO: Add node staking when implementing nodes.
    const {
      privateKey,
      passphrase,
      chains,
      address,
    } = ApplicationService.getApplicationInfo();
    const application = {privateKey, passphrase};

    const url = _getDashboardPath(DASHBOARD_PATHS.editApp);
    const detail = url.replace(":address", address);
    const applicationlink = `${window.location.origin}${detail}`;

    const {success, data} = ApplicationService.stakeApplication(
      application, chains, result.paymentIntent.id, applicationlink
    );

    if (success && data === true) {
      this.goToInvoice();
    } else {
      // TODO: Add meaningful message on backend instead of false
      this.setState({
        alert: {
          show: true,
          variant: "warning",
          message: "There was an error staking your app",
        },
      });
      scrollToId("alert");
    }
  }

  saveNewCardNoAddress(e, cardData, stripe) {
    e.preventDefault();

    const {cardHolderName: name} = cardData;

    const billingDetails = {
      name,
    };

    StripePaymentService.createPaymentMethod(
      stripe, cardData.card, billingDetails
    ).then(async (result) => {
      if (result.errors) {
        this.setState({
          alert: {
            show: true,
            variant: "warning",
            message: "There was an error adding your card",
          },
        });
        return;
      }

      if (result.paymentMethod) {
        const user = UserService.getUserInfo().email;
        const paymentMethods = await PaymentService.getPaymentMethods(user);

        const selectedPaymentMethod = paymentMethods.find(
          (pm) => result.paymentMethod.id === pm.id
        );

        const alert = {
          show: true,
          variant: "primary",
          message: "Your payment method was successfully added",
        };

        this.setState({alert, paymentMethods, selectedPaymentMethod});
      }
    });
  }

  render() {
    const {
      selectedPaymentMethod,
      paymentMethods: allPaymentMethods,
      quantity,
      total,
      cost,
      balance,
      loading,
      agreeTerms,
      alert,
      unauthorized,
    } = this.state;

    const cards = [
      {title: quantity.number, subtitle: quantity.description},
      {title: `${cost.number} USD`, subtitle: cost.description},
      {
        title: `-${balance} USD`,
        subtitle: "Current Balance",
      },
    ];

    const paymentMethods = allPaymentMethods.map((method) => {
      return {
        id: method.id,
        cardData: {
          type: method.brand,
          digits: `**** **** **** ${method.lastDigits}`,
        },
        holder: method.billingDetails.name,
      };
    });

    if (loading) {
      return <Loader />;
    }

    if (unauthorized) {
      return <UnauthorizedAlert />;
    }

    return (
      <div id="order-summary">
        {alert.show && (
          <AppAlert
            dismissible
            onClose={() => this.setState({alert: {show: false}})}
            title={alert.message}
            variant={alert.variant}
          ></AppAlert>
        )}
        <div className="title-page mb-4">
          <h1>Order summary</h1>
        </div>
        <Row>
          <Col lg="8" md="8" sm="8" className="title-page">
            <h2 className="sub">Confirm your payment method</h2>
            <Form className="cards">
              {paymentMethods.map((card, idx) => {
                const {cardData, holder} = card;

                return (
                  <div key={idx} className="payment-method">
                    <Form.Check
                      inline
                      label=""
                      type="radio"
                      checked={card.id === selectedPaymentMethod.id}
                      onChange={() => {
                        this.setState({selectedPaymentMethod: card});
                      }}
                      id={`payment-method-${idx}`}
                    />
                    <CardDisplay
                      cardData={cardData}
                      holder={holder}
                      onDelete={this.deleteCard}
                    />
                  </div>
                );
              })}
            </Form>
            <h5 className="mt-5 mb-4">Add a new card</h5>
            <NewCardNoAddressForm
              formActionHandler={this.saveNewCardNoAddress}
              actionButtonName="Add card"
            />
          </Col>
          <Col lg="4" md="4" sm="4" className="title-page">
            <h2 className="sub">Review your order</h2>
            <div className="mt-5 order">
              {cards.map((c, idx) => (
                <div key={idx} className="item">
                  <p>{c.subtitle}</p>
                  <p>{c.title}</p>
                </div>
              ))}
            </div>
            <InfoCard
              className="pt-4 mb-4 pr-4 text-center"
              title={`${total} USD`}
              subtitle={"Total cost"}
            />
            <Form.Check
              checked={agreeTerms}
              onChange={() => this.setState({agreeTerms: !agreeTerms})}
              id="terms-checkbox"
              type="checkbox"
              className="mb-3"
              label={
                <p className="agree">
                  I agree to Pocket Purchase&#39;s{" "}
                  <Link to={_getDashboardPath(DASHBOARD_PATHS.termsOfService)}>
                    <br />
                    Terms and Condititons.
                  </Link>
                </p>
              }
            />
            <br />
            <PaymentContainer>
              <ElementsConsumer>
                {({_, stripe}) => (
                  <Form
                    onSubmit={(e) => this.makePurchaseWithSavedCard(e, stripe)}
                    className=""
                  >
                    <Button
                      disabled={!agreeTerms}
                      variant="primary"
                      className="confirm pr-5 pl-5"
                      type="submit"
                    >
                      <span>Confirm payment</span>
                    </Button>
                  </Form>
                )}
              </ElementsConsumer>
            </PaymentContainer>
          </Col>
        </Row>
      </div>
    );
  }
}

export default OrderSummary;
