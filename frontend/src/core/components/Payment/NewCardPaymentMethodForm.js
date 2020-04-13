import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import PaymentContainer from "./PaymentContainer";
import {CardCVCNumberInput, CardExpirationDateInput, CardNumberInput} from "./FormComponents";
import {CardNumberElement, ElementsConsumer} from "@stripe/react-stripe-js";
import "./Payment.scss";

class NewCardPaymentMethodForm extends Component {


  constructor(props, context) {
    super(props, context);

    this.handleCreateMethod = this.handleCreateMethod.bind(this);
  }

  async handleCreateMethod(e, stripeElements, stripe) {
    e.preventDefault();

    const cardNumber = stripeElements.getElement(CardNumberElement);

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: "card",
      card: cardNumber,
    });

    if (error) {
      console.log("[error]", error);
    } else {
      console.log("[PaymentMethod]", paymentMethod);
    }
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

                <Form onSubmit={(e) => this.handleCreateMethod(e, elements, stripe)}>
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
                  <div className="submit float-right mt-2">
                    <Button variant="dark" size="lg" type="submit">
                      Save
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

export default NewCardPaymentMethodForm;
