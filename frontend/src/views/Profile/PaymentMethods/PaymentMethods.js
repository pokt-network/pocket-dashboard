import React, {Component} from "react";
import "./PaymentMethods.scss";
import {Col, Row} from "react-bootstrap";
import CardDisplay from "../../../core/components/CardDisplay/CardDisplay";
import PaymentService from "../../../core/services/PocketPaymentService";
import UserService from "../../../core/services/PocketUserService";
import StripePaymentService from "../../../core/services/PocketStripePaymentService";
import NewCardForm from "../../../core/components/Payment/Stripe/NewCardForm";

class PaymentMethods extends Component {
  constructor(props, context) {
    super(props, context);

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
    {
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

      stripe
        .createPaymentMethod({
          type: "card",
          card: cardData.card,
          billing_details: billingDetails,
        })
        .then(async function (result) {
          console.log(result);
          if (result.errors) {
            // TODO: Show message to frontend
            console.log(result.errors);
            return;
          }

          const {id} = result.paymentMethod;

          const saved = await StripePaymentService.__savePaymentMethod(
            id, billingDetails);

          // TODO: Show message to frontend
          console.log(saved);
        });
    }
  }

  deleteCard() {
    // TODO: Implement
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
                  onDelete={this.deleteCard}
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
