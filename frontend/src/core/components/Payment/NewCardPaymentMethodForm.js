import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import PaymentContainer from "./PaymentContainer";

class NewCardPaymentMethodForm extends Component {

  render() {
    return (
      <PaymentContainer>
        <Row>
          <h2>Add Payment method</h2>
        </Row>

        <Row>
          <Col>

          </Col>
          <Col>

          </Col>
        </Row>
      </PaymentContainer>
    );
  }
}

export default NewCardPaymentMethodForm;
