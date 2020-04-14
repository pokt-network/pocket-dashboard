import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import PaymentContainer from "./PaymentContainer";
import {CardCVCNumberInput, CardExpirationDateInput, CardNumberInput} from "./FormComponents";
import {CardNumberElement, ElementsConsumer} from "@stripe/react-stripe-js";
import "../Payment.scss";
import PropTypes from "prop-types";
import {PAYMENT_REGION_OR_COUNTRY} from "../../../../_constants";
import PocketStripePaymentService from "../../../services/PocketStripePaymentService";

class NewCardPaymentMethodForm extends Component {


  constructor(props, context) {
    super(props, context);

    this.handlePayMethod = this.handlePayMethod.bind(this);
  }

  handlePayMethod(e, stripeElements, stripe) {
    e.preventDefault();

    const {paymentIntentID} = this.props;
    const cardNumber = stripeElements.getElement(CardNumberElement);

    // TODO: Data validation
    const billingDetails = {
      name: "Tester",
      address: {
        line1: "Line 1",
        postal_code: "Postal code",
        country: "US"
      }
    };

    PocketStripePaymentService.confirmPaymentWithNewCard(stripe, paymentIntentID, cardNumber, billingDetails)
      .then(result => {
        // TODO: Post-process payment result
        console.log(result);
      });
  }

  render() {
    return (
      <PaymentContainer>
        <ElementsConsumer>
          {
            ({elements, stripe}) => (
              <div>
                <Row>
                  <h2>Add Payment method</h2>
                </Row>

                <Form onSubmit={(e) => this.handlePayMethod(e, elements, stripe)}>
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
                          name="billingAddressLine1"
                          type="text"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col sm="6" md="6" lg="6">
                      <Form.Group>
                        <Form.Label>Zip Code</Form.Label>
                        <Form.Control
                          name="zipCode"
                          type="text"
                        />
                      </Form.Group>
                    </Col>
                    <Col sm="6" md="6" lg="6">
                      <Form.Group>
                        <Form.Label>Region/Country</Form.Label>
                        <Form.Control as="select">
                          {
                            PAYMENT_REGION_OR_COUNTRY.map(country => (
                              <option key={country.code}>{country.name}</option>
                            ))
                          }
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>
                  <div className="submit float-right mt-2">
                    <Button variant="dark" size="lg" type="submit">
                      Save and Pay
                    </Button>
                  </div>
                </Form>
              </div>
            )
          }
        </ElementsConsumer>
      </PaymentContainer>
    );
  }
}

NewCardPaymentMethodForm.propTypes = {
  paymentIntentID: PropTypes.string
};

export default NewCardPaymentMethodForm;
