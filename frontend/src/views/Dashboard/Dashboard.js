import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import {Alert, Button, ButtonGroup, Col, Dropdown, Row} from "react-bootstrap";
import "./Dashboard.scss";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../_routes";
import {Link} from "react-router-dom";
import InfoCard from "../../core/components/InfoCard/InfoCard";
import SortableTable from "../../core/components/SortableTable";
import {NETWORK_TABLE_COLUMNS} from "../../constants";

// TODO: Remove dummy data and connect to backend.
const chains = [
  {
    name: "Aion Testnet Network",
    netID: 32,
    hash: "a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309",
  },
  {
    name: "Aion Mainnet Network",
    netID: 256,
    hash: "8ef9a7c67f6f8ad14f82c1f340963951245f912f037a7087f3f2d2f9f9ee38a8",
  },
  {
    name: "Ethereum Mainnet Network",
    netID: 1,
    hash: "0de3141aec1e69aea9d45d9156269b81a3ab4ead314fbf45a8007063879e743b",
  },
  {
    name: "Ethereum Rinkeby Network",
    netID: 4,
    hash: "8cf7f8799c5b30d36c86d18f0f4ca041cf1803e0414ed9e9fd3a19ba2f0938ff",
  },
  {
    name: "Ethereum Ropsten Network",
    netID: 3,
    hash: "10d1290eee169e3970afb106fe5417a11b81676ce1e2119a0292df29f0445d30",
  },
  {
    name: "Ethereum Goerli Network",
    netID: 5,
    hash: "4ae7539e01ad2c42528b6a697f118a3535e404fe65999b2c6fee506465390367",
  },
];

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      alert: true,
    };
  }

  render() {
    const {alert} = this.state;

    const cards = [
      {title: "US $0.60", subtitle: "POKT Price"},
      {title: "33,456", subtitle: "Total Staked Tokens"},
      {title: "23,345", subtitle: "Total of nodes"},
      {title: "21,479", subtitle: "Total Staked nodes"},
      {title: "38,353", subtitle: "Total of apps"},
      {title: "37,235", subtitle: "Total Staked apps"},
    ];

    return (
      <div id="dashboard">
        {alert && (
          <Alert
            variant="secondary"
            onClose={() => this.setState({alert: false})}
            dismissible
          >
            <Alert.Heading>
              Welcome back {UserService.getUserInfo().name}!
            </Alert.Heading>
          </Alert>
        )}
        <Row>
          <Col sm="8" md="8" lg="8">
            <h2 className="ml-1">Network Information</h2>
          </Col>
          <Col
            sm="4"
            md="4"
            lg="4"
            className="d-flex justify-content-end general-info"
          >
            <Dropdown as={ButtonGroup} className="cta">
              <Button variant="dark" className="ml-4 pl-5 pr-5">
                Apps
              </Button>

              <Dropdown.Toggle split variant="dark" id="dropdown-split-basic" />

              <Dropdown.Menu>
                <Link to={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}>
                  <Dropdown.Item as="button">Create new app</Dropdown.Item>
                </Link>
                <Dropdown.Item href="#/action-2">Import app</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Dropdown as={ButtonGroup} className="cta">
              <Button variant="secondary" className="ml-4 pl-5 pr-5">
                Nodes
              </Button>

              <Dropdown.Toggle
                split
                variant="secondary"
                id="dropdown-split-basic"
              />

              <Dropdown.Menu>
                <Link to={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}>
                  <Dropdown.Item as="button">Create new node</Dropdown.Item>
                </Link>
                <Dropdown.Item href="#/action-2">Import node</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row className="stats mt-3 mb-4">
          {cards.map((card) => (
            <Col key={card.title}>
              <InfoCard title={card.title} subtitle={card.subtitle} />
            </Col>
          ))}
        </Row>
        <Row>
          <Col lg="6">
            <SortableTable
              title="Supported Blockchains"
              columns={NETWORK_TABLE_COLUMNS}
              data={chains}
            />
          </Col>
          <Col lg="6">
            <SortableTable
              title="Most popular chains"
              columns={NETWORK_TABLE_COLUMNS}
              data={chains}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col lg="6">
            <SortableTable
              title="Registered  Nodes"
              columns={NETWORK_TABLE_COLUMNS}
              data={chains}
            />
          </Col>
          <Col lg="6">
            <SortableTable
              title="Registered Apps"
              columns={NETWORK_TABLE_COLUMNS}
              data={chains}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
