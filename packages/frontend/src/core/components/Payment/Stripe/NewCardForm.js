import React, { Component } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import PaymentContainer from "./PaymentContainer";
import {
  CardCVCNumberInput,
  CardExpirationDateInput,
  CardNumberInput,
} from "./FormComponents";
import { CardNumberElement, ElementsConsumer } from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import { PAYMENT_REGION_OR_COUNTRY } from "../../../../_constants";
import "../Payment.scss";

class NewCardForm extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      data: {
        cardHolderName: "",
        billingAddressLine1: "",
        zipCode: "",
        country: "",
      },
    };

    this.handlePayMethod = this.handlePayMethod.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange({ currentTarget: input }) {
    const data = { ...this.state.data };

    data[input.name] = input.value;
    this.setState({ data });
  }

  /**
   * Validate form data.
   *
   * @return {boolean} If validation was succeeded or not.
   * @throws Error If validation fails.
   */
  validateForm() {
    const {
      cardHolderName,
      billingAddressLine1,
      zipCode,
      country,
    } = this.state.data;

    if (!cardHolderName) {
      throw Error("Card holder name cannot be empty");
    }

    if (!zipCode) {
      throw Error("Zip code cannot be empty");
    }

    if (!billingAddressLine1) {
      throw Error("Address line 1 cannot be empty");
    }

    if (!country) {
      throw Error("Country cannot be empty");
    }

    return true;
  }

  handlePayMethod(e, stripeElements, stripe) {
    e.preventDefault();

    try {
      this.validateForm();

      const cardNumber = stripeElements.getElement(CardNumberElement);
      const {
        cardHolderName,
        billingAddressLine1,
        zipCode,
        country,
      } = this.state.data;

      const cardData = {
        card: cardNumber,
        cardHolderName,
        billingAddressLine1,
        zipCode,
        country,
      };

      this.props.formActionHandler(e, cardData, stripe);
    } catch (err) {
      this.props.formActionHandler(e, err, stripe);
    }
  }

  render() {
    const { cardHolderName, billingAddressLine1, zipCode } = this.state.data;
    const { formTitle, actionButtonName } = this.props;

    return (
      <PaymentContainer>
        <ElementsConsumer>
          {({ elements, stripe }) => (
            <div>
              <Row>
                <h2>{formTitle}</h2>
              </Row>

              <Form onSubmit={(e) => this.handlePayMethod(e, elements, stripe)}>
                <Row>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>Credit card number*</Form.Label>
                      <CardNumberInput />
                    </Form.Group>
                  </Col>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>Card holder name*</Form.Label>
                      <Form.Control
                        name="cardHolderName"
                        type="text"
                        value={cardHolderName}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>Exp. Date*</Form.Label>
                      <CardExpirationDateInput />
                    </Form.Group>
                  </Col>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>CVC*</Form.Label>
                      <CardCVCNumberInput />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm="12" md="12" lg="12">
                    <Form.Group>
                      <Form.Label>Billing Address Line 1*</Form.Label>
                      <Form.Control
                        name="billingAddressLine1"
                        type="text"
                        value={billingAddressLine1}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>Zip Code*</Form.Label>
                      <Form.Control
                        name="zipCode"
                        type="text"
                        value={zipCode}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>Region/Country*</Form.Label>
                      <Form.Control
                        name="country"
                        as="select"
                        onChange={this.handleChange}
                      >
                        <option />
                        {PAYMENT_REGION_OR_COUNTRY.map((country) => (
                          <option key={country.code} value={country.code}>
                            {country.name}
                          </option>
                        ))}
                      </Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="submit float-right mt-2">
                  <Button variant="primary" size="md" type="submit">
                    {actionButtonName}
                  </Button>
                </div>
              </Form>
            </div>
          )}
        </ElementsConsumer>
      </PaymentContainer>
    );
  }
}

// noinspection JSUnusedGlobalSymbols,JSUnusedLocalSymbols
NewCardForm.defaultProps = {
  formTitle: "Add Payment method",
  actionButtonName: "Save",
  formActionHandler: (event, formData, stripe) => {},
};

NewCardForm.propTypes = {
  formTitle: PropTypes.string,
  actionButtonName: PropTypes.string,
  formActionHandler: PropTypes.func,
};

export default NewCardForm;
