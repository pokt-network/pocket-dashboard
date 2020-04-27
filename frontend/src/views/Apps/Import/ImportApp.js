import React, {Component} from "react";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import {
  Alert,
  Col,
  FormControl,
  InputGroup,
  Button,
  Row,
  Spinner,
} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import {
  NETWORK_TABLE_COLUMNS,
  BOND_STATUS,
  BOND_STATUS_STR,
} from "../../../_constants";
import "./ImportApp.scss";
import ApplicationService from "../../../core/services/PocketApplicationService";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import AccountService from "../../../core/services/PocketAccountService";
import NetworkService from "../../../core/services/PocketNetworkService";

class Import extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleChange = this.handleChange.bind(this);
    this.handleAppImport = this.handleAppImport.bind(this);

    this.state = {
      loading: false,
      stakedTokens: 0,
      poktBalance: 0,
      stakeStatus: "--",
      maxRelays: "--",
      jailed: "--",
      address: "",
      chains: [],
      privateKey: "",
      imported: false,
      data: {
        applicationPrivateKey: "",
      },
    };
  }

  async handleAppImport() {
    this.setState({loading: true});
    const {applicationPrivateKey} = this.state.data;

    const {message, address} = await AccountService.importAccount(
      applicationPrivateKey
    );

    if (message) {
      // TODO: display error on frontend
      console.log(message);
      this.setState({loading: false, imported: false});
      return;
    }

    // If the call now throws an error, it means the application is
    // unstaked/unbonded, as it has been already validated that the app exists.
    try {
      const {
        chains: allChains,
        max_relays: maxRelays,
        status: stakeStatus,
        staked_tokens: stakedTokens,
      } = await ApplicationService.getNetworkAppInfo(address);

      const chains = await NetworkService.getNetworkChains(allChains);

      this.setState({chains, address, stakedTokens, maxRelays, stakeStatus});
    } catch {
      // Unstaked/Unbonded application
      this.setState({
        address,
        stakeStatus: BOND_STATUS_STR.unbonded,
        stakedTokens: 0,
        maxRelays: "--",
      });
    }
    this.setState({
      privateKey: applicationPrivateKey,
      loading: false,
      imported: true,
    });
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  render() {
    const {
      stakedTokens,
      poktBalance,
      stakeStatus: status,
      maxRelays,
      address,
      chains,
      loading,
      imported,
      privateKey,
    } = this.state;

    const stakeStatus = status === "--" ? "--" : BOND_STATUS[status];

    const generalInfo = [
      {title: `${stakedTokens} POKT`, subtitle: "Stake tokens"},
      {title: `${poktBalance} POKT`, subtitle: "Balance"},
      {title: stakeStatus, subtitle: "Stake status"},
      {title: maxRelays, subtitle: "Max Relays"},
    ];

    return (
      <div id="import-app">
        <Row>
          <Col id="head">
            <h1>We are ready to import your app</h1>
            <p className="sub">Please enter your private key</p>
            <InputGroup className="mb-3 import-input" size="lg">
              <FormControl
                name="applicationPrivateKey"
                onChange={this.handleChange}
                onKeyPress={({key}) => {
                  if (key === "Enter") {
                    this.handleAppImport();
                  }
                }}
              />
              <InputGroup.Append>
                <Button
                  className="pr-5 pl-5 pt-3 pb-3"
                  type="submit"
                  onClick={this.handleAppImport}
                  variant="dark"
                >
                  {loading ? (
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                    />
                  ) : (
                    "Import"
                  )}
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
        <Link
          to={{
            pathname: _getDashboardPath(DASHBOARD_PATHS.createAppInfo),
            state: {
              imported: imported,
              stakeStatus: status,
              address: address,
              privateKey: privateKey,
            },
          }}
        >
          <Button
            disabled={!imported}
            variant="secondary"
            size="lg"
            className="float-right pl-5 pr-5 mt-3 mb-3"
          >
            Continue
          </Button>
        </Link>
      </div>
    );
  }
}

export default Import;
