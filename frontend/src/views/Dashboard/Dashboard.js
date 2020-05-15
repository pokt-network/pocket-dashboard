import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import {Alert, Col, Dropdown, Row} from "react-bootstrap";
import "./Dashboard.scss";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../_routes";
import InfoCard from "../../core/components/InfoCard/InfoCard";
import {APPLICATIONS_LIMIT, NODES_LIMIT, TABLE_COLUMNS} from "../../_constants";
import NetworkService from "../../core/services/PocketNetworkService";
import Loader from "../../core/components/Loader";
import ApplicationService from "../../core/services/PocketApplicationService";
import {mapStatusToField} from "../../_helpers";
import NodeService from "../../core/services/PocketNodeService";
import Segment from "../../core/components/Segment/Segment";
import BootstrapTable from "react-bootstrap-table-next";

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      alert: true,
      loading: true,
      chains: [],
      userApps: [],
      userNodes: [],
    };
  }

  async componentDidMount() {
    const userEmail = UserService.getUserInfo().email;
    const userApps = await ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT
    );
    const userNodes = await NodeService.getAllUserNodes(userEmail, NODES_LIMIT);
    const chains = await NetworkService.getAvailableNetworkChains();
    const alert = UserService.getShowWelcomeMesage();

    this.setState({alert, userApps, userNodes, chains, loading: false});
  }

  render() {
    const {
      alert,
      chains,
      loading,
      userApps: allUserApps,
      userNodes: allUserNodes,
    } = this.state;

    // TODO: Integrate this data with backend.
    const cards = [
      {title: "US $0.60", subtitle: "POKT Price"},
      {title: "33,456", subtitle: "Total Staked Tokens"},
      {title: "23,345", subtitle: "Total of nodes"},
      {title: "21,479", subtitle: "Total Staked nodes"},
      {title: "38,353", subtitle: "Total of apps"},
      {title: "37,235", subtitle: "Total Staked apps"},
    ];

    if (loading) {
      return <Loader />;
    }

    const userApps = allUserApps.map(mapStatusToField);
    const userNodes = allUserNodes.map(mapStatusToField);

    return (
      <div id="dashboard">
        {alert && (
          <Alert
            variant="primary"
            onClose={() => {
              UserService.showWelcomeMessage(false);
              this.setState({alert: false});
            }}
            dismissible
          >
            <h4 className="font-weight-bold ml-3 mt-2 mb-4">
              WELCOME BACK {UserService.getUserInfo().name}!
            </h4>
          </Alert>
        )}
        <Row>
          <Col sm="8" md="8" lg="8">
            <h1 className="ml-1">NETWORK INFORMATION</h1>
          </Col>
          <Col sm="4" md="4" lg="4" className="d-flex justify-content-end">
            <Dropdown className="cta mr-2">
              <Dropdown.Toggle className="pl-4 pr-4" variant="primary" id="dropdown-basic">
                Apps
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    // eslint-disable-next-line react/prop-types
                    this.props.history.push(
                      _getDashboardPath(DASHBOARD_PATHS.createAppInfo)
                    )
                  }
                >
                  Create
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() =>
                    // eslint-disable-next-line react/prop-types
                    this.props.history.push(
                      _getDashboardPath(DASHBOARD_PATHS.importApp)
                    )
                  }
                >
                  Import
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
            <Dropdown className="cta">
              <Dropdown.Toggle className="pl-4 pr-4" variant="dark" id="dropdown-basic">
                Nodes
              </Dropdown.Toggle>

              <Dropdown.Menu>
                <Dropdown.Item
                  onClick={() =>
                    // eslint-disable-next-line react/prop-types
                    this.props.history.push(
                      _getDashboardPath(DASHBOARD_PATHS.createNodeForm)
                    )
                  }
                >
                  Create
                </Dropdown.Item>

                <Dropdown.Item
                  onClick={() =>
                    // eslint-disable-next-line react/prop-types
                    this.props.history.push(
                      _getDashboardPath(DASHBOARD_PATHS.importNode)
                    )
                  }
                >
                  Import
                </Dropdown.Item>
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
          <Col lg="6" md="6" sm="6">
            <Segment label="Registered Nodes">
              <BootstrapTable
                classes="app-table"
                keyField="pocketNode.publicPocketAccount.address"
                data={userNodes}
                columns={TABLE_COLUMNS.NODES}
                bordered={false}
              />
            </Segment>
          </Col>
          <Col lg="6" md="6" sm="6">
            <Segment label="Registered Apps">
              <BootstrapTable
                classes="app-table"
                keyField="pocketApplication.publicPocketAccount.address"
                data={userApps}
                columns={TABLE_COLUMNS.APPS}
                bordered={false}
              />
            </Segment>
          </Col>
        </Row>
        <Row className="mt-5 mb-4">
          <Col lg="12" md="12" sm="12">
            <Segment label="Supported Blockchains">
              <BootstrapTable
                classes="app-table"
                keyField="hash"
                data={chains}
                columns={TABLE_COLUMNS.NETWORK_CHAINS}
                bordered={false}
              />
            </Segment>
          </Col>
          <Col lg="12" md="12" sm="12">
            <Segment label="Most popular chains">
              <BootstrapTable
                classes="app-table"
                keyField="hash"
                data={chains}
                columns={TABLE_COLUMNS.NETWORK_CHAINS}
                bordered={false}
              />
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Dashboard;
