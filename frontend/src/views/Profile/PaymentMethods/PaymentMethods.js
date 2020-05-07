import React, {Component} from "react";
import "./PaymentMethods.scss";
import {Col, Row} from "react-bootstrap";
import CardDisplay from "../../../core/components/CardDisplay/CardDisplay";
import PocketPaymentService from "../../../core/services/PocketPaymentService";
import PocketUserService from "../../../core/services/PocketUserService";

class PaymentMethods extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      paymentMethods: [],
    };
  }

  async componentDidMount() {
    const user = PocketUserService.getUserInfo().email;
    const paymentMethods = await PocketPaymentService.getPaymentMethods(user);

    this.setState({paymentMethods});
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
        </Col>
      </Row>
    );
  }
}

export default PaymentMethods;
