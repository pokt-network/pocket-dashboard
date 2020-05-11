import React, {Component} from "react";
import "./PaymentMethods.scss";
import {Col, Row} from "react-bootstrap";
import CardDisplay from "../../../core/components/Payment/CardDisplay/CardDisplay";
import PaymentService from "../../../core/services/PocketPaymentService";
import UserService from "../../../core/services/PocketUserService";
import StripePaymentService from "../../../core/services/PocketStripePaymentService";
import NewCardForm from "../../../core/components/Payment/Stripe/NewCardForm";

class PaymentMethods extends Component {
  constructor(props, context) {
    super(props, context);

    this.deleteCard = this.deleteCard.bind(this);

    this.state = {
      paymentMethods: [],
    };
  }

  async componentDidMount() {
    const user = UserService.getUserInfo().email;
    const paymentMethods = await PaymentService.getPaymentMethods(user);

    this.setState({paymentMethods});
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
      stripe,
      cardData.card,
      billingDetails
    ).then((result) => {
      if (result.errors) {
        // TODO: Show message to frontend
        console.log(result.errors);
        return;
      }

      if (result.paymentMethod) {
        // TODO: Show message to frontend
        console.log(true);
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
      // TODO: Show message on frontend.
    }
  }

  render() {
    const {paymentMethods: allPaymentMethods} = this.state;
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

    return (
      <Row id="payment-methods">
        <Col>
          <h1 className="mb-3">Payment methods</h1>
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
          <div id="card-form">
            <NewCardForm formActionHandler={this.saveNewCard} />
          </div>
        </Col>
      </Row>
    );
  }
}

export default PaymentMethods;
