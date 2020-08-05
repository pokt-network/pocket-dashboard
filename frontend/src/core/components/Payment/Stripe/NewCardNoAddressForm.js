import React, {Component} from "react";
import isEmpty from "lodash/isEmpty";
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
      agreeDefault: "",
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
    } catch (err) {
      this.props.formActionHandler(e, err, stripe);
    }
  }

  render() {
    const {agreeDefault} = this.state;
    const {cardHolderName} = this.state.data;
    const {formTitle, actionButtonName, setDefaultHandler} = this.props;

    return (
      <PaymentContainer>
        <ElementsConsumer>
          {({elements, stripe}) => (
            <div>
              {!isEmpty(formTitle) && (
                <Row>
                  <h2>{formTitle}</h2>
                </Row>
              )}
              <Form onSubmit={(e) => this.handlePayMethod(e, elements, stripe)}>
                <Row>
                  <Col md="4">
                    <Form.Group>
                      <Form.Label>Name on Card*</Form.Label>
                      <Form.Control
                        name="cardHolderName"
                        placeholder="Example name"
                        type="text"
                        value={cardHolderName}
                        onChange={this.handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col md="4">
                    <Form.Group>
                      <Form.Label>Card Number*</Form.Label>
                      <CardNumberInput />
                    </Form.Group>
                  </Col>
                  <Col md="2">
                    <Form.Group>
                      <Form.Label className="text-nowrap">
                        Exp. Date*
                      </Form.Label>
                      <CardExpirationDateInput />
                    </Form.Group>
                  </Col>
                  <Col md="2">
                    <Form.Group>
                      <Form.Label>CVC*</Form.Label>
                      <CardCVCNumberInput />
                    </Form.Group>
                  </Col>
                </Row>
                {setDefaultHandler && (
                  <div>
                    <Form.Check
                      checked={agreeDefault}
                      onChange={() => {
                        this.setState({agreeDefault: !agreeDefault});
                        setDefaultHandler(!agreeDefault);
                      }}
                      id="terms-checkbox"
                      type="checkbox"
                      className="mb-3"
                      label={
                        <span className="font-weight-light">
                          Set as default payment method.
                        </span>
                      }
                    />
                  </div>
                )}
                <div className="submit mt-2">
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
  setDefault: undefined,
  formActionHandler: (event, formData, stripe) => {},
};

NewCardNoAddressForm.propTypes = {
  formTitle: PropTypes.string,
  actionButtonName: PropTypes.string,
  formActionHandler: PropTypes.func,
  setDefaultHandler: PropTypes.func,
};

export default NewCardNoAddressForm;
