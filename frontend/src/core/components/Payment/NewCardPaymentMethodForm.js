import React, {Component} from "react";
import {Col, Form, Row} from "react-bootstrap";
import PaymentContainer from "./PaymentContainer";
import {CardCVCNumberInput, CardExpirationDateInput, CardNumberInput} from "./FormComponents";

import "./Payment.scss";

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
              <Form.Group>
                <Form.Label>Credit card number*</Form.Label>
                <CardNumberInput/>
              </Form.Group>
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
                <CardExpirationDateInput/>
              </Form.Group>
            </Col>
            <Col sm="6" md="6" lg="6">
              <Form.Group>
                <Form.Label>CVC/CVC2*</Form.Label>
                <CardCVCNumberInput/>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm="12" md="12" lg="12">
              <Form.Group>
                <Form.Label>Billing Address Line 1</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="2"
                  name="billingAddress"
                />
              </Form.Group>
            </Col>
          </Row>

          <Row>
            <Col sm="6" md="6" lg="6">
              <Form.Group>
                <Form.Label>Zip Code</Form.Label>
                <Form.Control
                  name="cvc"
                  type="zipCode"
                />
              </Form.Group>
            </Col>
            <Col sm="6" md="6" lg="6">
              <Form.Group>
                <Form.Label>Region/Country</Form.Label>
                <Form.Control
                  name="cvc"
                  type="country"
                />
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </PaymentContainer>
    );
  }
}

export default NewCardPaymentMethodForm;
