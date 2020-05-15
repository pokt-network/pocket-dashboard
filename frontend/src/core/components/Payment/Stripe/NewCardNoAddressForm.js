import React, {Component} from "react";
import {Button, Col, Form, Row} from "react-bootstrap";
import PaymentContainer from "./PaymentContainer";
import {
  CardCVCNumberInput,
  CardExpirationDateInput,
  CardNumberInput,
} from "./FormComponents";
import {CardNumberElement, ElementsConsumer} from "@stripe/react-stripe-js";
import PropTypes from "prop-types";
import "../Payment.scss";

class NewCardNoAddressForm extends Component {
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

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  /**
   * Validate form data.
   *
   * @return {boolean} If validation was succeeded or not.
   * @throws Error If validation fails.
   */
  validateForm() {
    const {cardHolderName} = this.state.data;

    if (!cardHolderName) {
      throw Error("Card holder name cannot be empty");
    }
    return true;
  }

  handlePayMethod(e, stripeElements, stripe) {
    e.preventDefault();

    try {
      this.validateForm();

      const cardNumber = stripeElements.getElement(CardNumberElement);
      const {cardHolderName} = this.state.data;

      const cardData = {
        card: cardNumber,
        cardHolderName,
      };

      this.props.formActionHandler(e, cardData, stripe);
    } catch (e) {
      console.log(e.message);
    }
  }

  render() {
    const {cardHolderName} = this.state.data;
    const {formTitle, actionButtonName} = this.props;

    return (
      <PaymentContainer>
        <ElementsConsumer>
          {({elements, stripe}) => (
            <div>
              <Row>
                <h2>{formTitle}</h2>
              </Row>

              <Form onSubmit={(e) => this.handlePayMethod(e, elements, stripe)}>
                <Row>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>Name on card*</Form.Label>
                      <Form.Control
                        name="cardHolderName"
                        placeholder="Example name"
                        type="text"
                        value={cardHolderName}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>Card number*</Form.Label>
                      <CardNumberInput />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>Expiration Date*</Form.Label>
                      <CardExpirationDateInput />
                    </Form.Group>
                  </Col>
                  <Col sm="6" md="6" lg="6">
                    <Form.Group>
                      <Form.Label>CVC/CVC2*</Form.Label>
                      <CardCVCNumberInput />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="submit ml-3 mt-2">
                  <Button variant="dark" size="sm" type="submit">
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
NewCardNoAddressForm.defaultProps = {
  actionButtonName: "Save",
  formActionHandler: (event, formData, stripe) => {},
};

NewCardNoAddressForm.propTypes = {
  formTitle: PropTypes.string,
  actionButtonName: PropTypes.string,
  formActionHandler: PropTypes.func,
};

export default NewCardNoAddressForm;
