import React, {Component} from "react";
import "./PaymentMethods.scss";
import {Col, Row} from "react-bootstrap";
import CardDisplay from "../../../core/components/Payment/CardDisplay/CardDisplay";
import PaymentService from "../../../core/services/PocketPaymentService";
import UserService from "../../../core/services/PocketUserService";
import StripePaymentService from "../../../core/services/PocketStripePaymentService";
import NewCardForm from "../../../core/components/Payment/Stripe/NewCardForm";
import Loader from "../../../core/components/Loader";
import AppAlert from "../../../core/components/AppAlert";

class PaymentMethods extends Component {
  constructor(props, context) {
    super(props, context);

    this.deleteCard = this.deleteCard.bind(this);
    this.saveNewCard = this.saveNewCard.bind(this);

    this.state = {
      alert: {show: false, text: "", variant: ""},
      paymentMethods: [],
      newCard: false,
      loading: false,
    };
  }

  async componentDidMount() {
    this.setState({loading: true});

    const user = UserService.getUserInfo().email;
    const paymentMethods = await PaymentService.getPaymentMethods(user);

    this.setState({paymentMethods, loading: false});
  }

  saveNewCard(e, cardData, stripe) {
    e.preventDefault();

    const {
      cardHolderName: name,
      billingAddressLine1: line1,
      zipCode: postal_code,
      country,
    } = cardData;

    const billingDetails = {
      name,
      address: {line1, postal_code, country},
    };

    StripePaymentService.createPaymentMethod(
      stripe, cardData.card, billingDetails
    ).then((result) => {
      if (result.errors) {
        this.setState({
          alert: {
            show: true,
            variant: "danger",
            text: result.errors,
          },
        });
        return;
      }

      if (result.paymentMethod) {
        this.setState({
          alert: {
            show: true,
            variant: "primary",
            text: "Your payment method was successfully added.",
          },
        });
      }
    });
  }

  async deleteCard(paymentMehodId) {
    const {paymentMethods: allPaymentMethods} = this.state;

    const paymentMethods = allPaymentMethods.filter(
      (m) => m.id !== paymentMehodId
    );

    const success = await PaymentService.deletePaymentMethod(paymentMehodId);

    if (success) {
      this.setState({paymentMethods});
    } else {
      this.setState({
        alert: {
          show: true,
          variant: "danger",
          text: "There was an error deleting you payment method.",
        },
      });
    }
  }

  render() {
    const {
      alert,
      paymentMethods: allPaymentMethods,
      newCard,
      loading,
    } = this.state;
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

    return (
      <Row id="general" className="payment-methods">
        <Col lg={{span: 10, offset: 1}} className="title-page">
          {alert.show && (
              <AppAlert
                variant={alert.variant}
                title={alert.text}
                dismissible
                onClose={() => this.setState({alert: {show: false}})}
              />
            )}  
          <div className="wrapper">
            <h1> Payment methods</h1>
            <div id="cards">
              {paymentMethods.map((card, idx) => {
                const {cardData, holder} = card;

                return (
                  <CardDisplay
                    key={idx}
                    cardData={cardData}
                    holder={holder}
                    onDelete={() => {
                      this.deleteCard(card.id);
                    }}
                  />
                );
              })}
            </div>
            <br />
            {!newCard && (
              <p
                onClick={() => this.setState({newCard: true})}
                className="new-card"
              >
                Add a new card
              </p>
            )}
            {newCard && (
              <div id="card-form">
                <NewCardForm
                  formTitle=""
                  formActionHandler={this.saveNewCard}
                />
              </div>
            )}
          </div>
        </Col>
      </Row>
    );
  }
}

export default PaymentMethods;
