import React, {Component} from "react";
import "./PaymentMethods.scss";
import {Col, Row} from "react-bootstrap";
import CardDisplay from "../../../core/components/CardDisplay/CardDisplay";

const dummy_card_data = [
  {
    cardData: "Visa **** **** **** 1183",
    holder: "John Doe",
  },
  {
    cardData: "Visa **** **** **** 4824",
    holder: "John Doe",
  },
  {
    cardData: "Visa **** **** **** 1058",
    holder: "John Doe",
  },
  {
    cardData: "Visa **** **** **** 5820",
    holder: "John Doe",
  },
  {
    cardData: "Visa **** **** **** 4583",
    holder: "John Doe",
  },
  {
    cardData: "Visa **** **** **** 9393",
    holder: "John Doe",
  },
  {
    cardData: "Visa **** **** **** 9393",
    holder: "John Doe",
  },
  {
    cardData: "Visa **** **** **** 9393",
    holder: "John Doe",
  },
];

class PaymentMethods extends Component {
  render() {
    return (
      <Row id="payment-methods">
        <Col>
          <h1 className="mb-3">Payment methods</h1>
          <div id="cards">
            {dummy_card_data.map((card, idx) => {
              const {cardData, holder} = card;

              return (
                <CardDisplay key={idx} cardData={cardData} holder={holder} />
              );
            })}
          </div>
        </Col>
      </Row>
    );
  }
}

export default PaymentMethods;
