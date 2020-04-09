import React, {Component} from "react";
import {Col, Form, Row} from "react-bootstrap";
import PaymentContainer from "./PaymentContainer";

class NewCardPaymentMethodForm extends Component {

  render() {
    return (
      <PaymentContainer>
        <Row>
          <h2>Add Payment method</h2>
        </Row>

        <Form>
          <Row>
            <Col sm="6" md="6" lg="6">
              Credit card number
            </Col>
            <Col sm="6" md="6" lg="6">
              <Form.Group>
                <Form.Label>Card holder name*</Form.Label>
                <Form.Control
                  name="cardHolderName"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm="6" md="6" lg="6">
              <Form.Group>
                <Form.Label>Expiration Date*</Form.Label>
                <Form.Control
                  name="expirationDate"
                  type="text"
                />
              </Form.Group>
            </Col>
            <Col sm="6" md="6" lg="6">
              <Form.Group>
                <Form.Label>CVC/CVC2*</Form.Label>
                <Form.Control
                  name="cvc"
                  type="text"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            Billing Adddres Line 1
          </Row>

          <Row>
            <Col sm="6" md="6" lg="6">
              Zip Code
            </Col>
            <Col sm="6" md="6" lg="6">
              Region/Country
            </Col>
          </Row>
        </Form>
      </PaymentContainer>
    );
  }
}

export default NewCardPaymentMethodForm;
