import React, {Component} from "react";
import "./NodesCheckout.scss";
import {Button, Col, Row} from "react-bootstrap";
import AppSteps from "../../../core/components/AppSteps/AppSteps";
import Invoice from "./Invoice";

class NodesCheckout extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      invoiceData: {
        owner: "Test",
        id: "1001",
        date: "15-4-2020",
        card: "Visa ****2345",
      },
      purchaseDetail: {
        relays: "100",
        cost: "100",
        balance: "50",
      },
    };
  }

  render() {
    const {owner, id, date, card} = this.state.invoiceData;

    // TODO: Remove dummy data when integrating with backend.
    const information = [
      {text: "Bill To", value: owner},
      {text: "Invoice", value: id},
      {text: "Date", value: date},
      {text: "Card Detail", value: card},
    ];

    const items = [
      {text: "Purchase detail 1", value: 2500},
      {text: "Purchase detail 2", value: 1500},
      {text: "Balance", value: 5500},
    ];

    return (
      <div id="nodes-checkout">
        <Row className="segment mb-3">
          <Col>
            <h2>Enjoy your purchase</h2>
            <p>Please wait a few minutes until the process is completed</p>
            <AppSteps
              current={1}
              steps={[
                "Purchase",
                "Encode and sign stake",
                "Successfull Node stake",
              ]}
            />
            <Button
              variant="dark pl-4"
              className="mt-3 pr-4 float-right font-weight-bold"
            >
              Go to node detail
            </Button>
          </Col>
        </Row>
        <Row className="segment mb-2">
          <Invoice information={information} items={items} total={400} />
        </Row>
        <Button
          variant="dark pl-4"
          className="mt-3 mb-5 mr-3 pr-5 pl-5 float-right font-weight-bold"
        >
          Print
        </Button>
      </div>
    );
  }
}

export default NodesCheckout;
