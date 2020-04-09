import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import {
  Alert,
  FormControl,
  InputGroup,
  Button,
  Row,
  Col,
} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {NETWORK_TABLE_COLUMNS} from "../../../constants";
import "./Import.scss";

class Import extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      stakeTokens: 0,
      poktBalance: 0,
      stakeStatus: "--",
      maxRelays: "--",
      jailed: "--",
      address: "",
      chains: [
        {
          hash: "",
          name: "",
          netID: "",
        },
      ],
    };
  }

  render() {
    const {
      stakeTokens,
      poktBalance,
      stakeStatus,
      maxRelays,
      jailed,
      address,
      chains,
    } = this.state;

    let statusCapitalized = "";

    if (stakeStatus) {
      statusCapitalized = stakeStatus[0].toUpperCase() + stakeStatus.slice(1);
    }

    const generalInfo = [
      {title: `${stakeTokens} POKT`, subtitle: "Stake tokens"},
      {title: `${poktBalance} POKT`, subtitle: "Balance"},
      {title: statusCapitalized, subtitle: "Stake status"},
      {title: maxRelays, subtitle: "Max Relays"},
      {title: jailed, subtitle: "Jailed"},
    ];

    return (
      <div id="import-app">
        <Row>
          <Col id="head">
            <h1>We are ready to import your app</h1>
            <p className="sub">Please enter your private key</p>
            <InputGroup className="mb-3 import-input" size="lg">
              <FormControl
                name="privateKey"
                onChange={this.handleChange}
                onKeyPress={({key}) => {
                  if (key === "Enter") {
                    this.handleAppSearch();
                  }
                }}
              />
              <InputGroup.Append>
                <Button
                  className="pr-5 pl-5 pt-3 pb-3"
                  type="submit"
                  onClick={this.handleAppSearch}
                  variant="dark"
                >
                  Import
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Col>
        </Row>
        <h2>General information</h2>
        <Row className="stats">
          {generalInfo.map((card, idx) => (
            <Col key={idx}>
              <InfoCard title={card.title} subtitle={card.subtitle} />
            </Col>
          ))}
        </Row>
        <Row className="mt-4">
          <Col>
            <p className="sub">Address</p>
            <Alert variant="dark">{address}</Alert>
          </Col>
        </Row>
        <Row>
          <Col>
            <p className="sub mb-3">Networks</p>
            <BootstrapTable
              classes="table app-table table-striped"
              keyField="hash"
              data={chains}
              columns={NETWORK_TABLE_COLUMNS}
              bordered={false}
            />
          </Col>
        </Row>
        <Button
          variant="secondary"
          size="lg"
          className="float-right pl-5 pr-5 mt-3 mb-3"
        >
          Continue
        </Button>
      </div>
    );
  }
}

export default Import;
