/* eslint-disable react/prop-types */
import React, {Component} from "react";
import {formatCurrency, formatNumbers} from "../../../_helpers";
import {Button, Col, Form, Row} from "react-bootstrap";
import CardDisplay from "../../../core/components/Payment/CardDisplay/CardDisplay";
import UserService from "../../../core/services/PocketUserService";
import PaymentService from "../../../core/services/PocketPaymentService";
import "./OrderSummary.scss";
import Loader from "../../../core/components/Loader";
import SaveAndPayForm from "../../../core/components/Payment/Stripe/SaveAndPayForm";
import {ElementsConsumer} from "@stripe/react-stripe-js";
import PaymentContainer from "../../../core/components/Payment/Stripe/PaymentContainer";
import StripePaymentService from "../../../core/services/PocketStripePaymentService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import InfoCard from "../../../core/components/InfoCard/InfoCard";

class OrderSummary extends Component {
  constructor(props, context) {
    super(props, context);

    this.makePurchaseWithSavedCard = this.makePurchaseWithSavedCard.bind(this);
    this.makePurchaseWithNewCard = this.makePurchaseWithNewCard.bind(this);
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
    };
  }

  async componentDidMount() {
    this.setState({loading: true});
    // eslint-disable-next-line react/prop-types
    if (this.props.location.state === undefined) {
      // TODO: Show message on frontend
      console.log("Error: you are not authorized to do this action");
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

    // TODO: Redirect user to invoice view
    console.log(result);
  }

  async makePurchaseWithNewCard({success, data}) {
    if (success) {
      // TODO: Show information to user in a proper way, and redirect to another path
      this.goToInvoice();
    } else {
      // TODO: Show information to user in a proper way.
      console.log(data);
    }
  }

  render() {
    const {
      selectedPaymentMethod,
      paymentMethods: allPaymentMethods,
      quantity,
      total,
      cost,
      balance,
      paymentIntent,
      loading,
      agreeTerms,
    } = this.state;

    const cards = [
      {title: formatNumbers(quantity.number), subtitle: quantity.description},
      {title: formatCurrency(cost.number), subtitle: cost.description},
      {
        title: `-${formatCurrency(balance)}`,
        subtitle: "Current Balance",
      },
      {title: formatCurrency(total), subtitle: "Total Cost"},
    ];

    const paymentMethods = allPaymentMethods.map((method) => {
      return {
        id: method.id,
        cardData: {
          // TODO: Retrieve card type data from backend
          type: "Visa",
          digits: `**** **** **** ${method.lastDigits}`,
        },
        holder: method.billingDetails.name,
      };
    });

    if (loading) {
      return <Loader />;
    }

    return (
      <div id="order-summary">
        <div className="title-page mb-4">
          <h2>Order summary</h2>
        </div>
        <Row>
          <Col lg="8" md="8" sm="8" className="title-page">
            <h4>Confirm your payment method</h4>
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
            <SaveAndPayForm
              handleAfterPayment={this.makePurchaseWithNewCard}
              paymentIntentSecretID={paymentIntent.paymentNumber}
            />
          </Col>
          <Col lg="4" md="4" sm="4" className="title-page">
            <h4>Review your order</h4>
            <div className="mt-5 order">
              <div className="item">
                <p>Relays per day</p>
                <p>100</p>
              </div>
              <div className="item">
                <p>Relays per day cost</p>
                <p>70 USD</p>
              </div>
              <div className="item">
                <p>Current balance</p>
                <p>-50 USD</p>
              </div>
              <InfoCard
                className="pt-5 mb-4 pr-4 text-center"
                title={"20 USD"}
                subtitle={"Total cost"}
              />
            </div>

            <Form.Check
              checked={agreeTerms}
              onChange={() => this.setState({agreeTerms: !agreeTerms})}
              id="terms-checkbox"
              type="checkbox"
              label={
                <p>
                  I agree to Pocket Purchase&#39;s{" "}
                  <a href="/todo">Terms and Condititons.</a>
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
                      className=" pr-5 pl-5"
                      type="submit"
                    >
                      Confirm payment
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
