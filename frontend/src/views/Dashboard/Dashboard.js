import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import {Alert, Col, Dropdown, Row} from "react-bootstrap";
import "./Dashboard.scss";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../_routes";
import InfoCard from "../../core/components/InfoCard/InfoCard";
import {APPLICATIONS_LIMIT, STYLING, TABLE_COLUMNS} from "../../_constants";
import NetworkService from "../../core/services/PocketNetworkService";
import Loader from "../../core/components/Loader";
import ApplicationService from "../../core/services/PocketApplicationService";
import {mapStatusToField} from "../../_helpers";
import Segment from "../../core/components/Segment/Segment";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AppTable from "../../core/components/AppTable";

// TODO: Integrate this data with backend.
const CARDS = [
  {title: "US $0.00", subtitle: "POKT Price"},
  {title: "33,456", subtitle: "Total Staked Tokens"},
  {title: "23,345", subtitle: "Total of nodes"},
  {title: "21,479", subtitle: "Total Staked nodes"},
  {title: "38,353", subtitle: "Total of apps"},
  {title: "37,235", subtitle: "Total Staked apps"},
];

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      welcomeAlert: true,
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
    // const userNodes = await NodeService.getAllUserNodes(userEmail, NODES_LIMIT);
    const chains = await NetworkService.getAvailableNetworkChains();
    const welcomeAlert = UserService.getShowWelcomeMessage();

    if (welcomeAlert) {
      UserService.showWelcomeMessage(false);
    }

    this.setState({welcomeAlert, userApps, chains, loading: false});
  }

  render() {
    const {
      welcomeAlert,
      chains,
      loading,
      userApps: allUserApps,
      userNodes: allUserNodes,
    } = this.state;

    if (loading) {
      return <Loader />;
    }

    const userApps = allUserApps.map(mapStatusToField);
    const userNodes = allUserNodes.map(mapStatusToField);

    return (
      <div id="dashboard">
        {welcomeAlert && (
          <Alert
            variant="primary"
            onClose={() => {
              this.setState({welcomeAlert: false});
            }}
            dismissible
          >
            <h4 className="font-weight-bold">
              WELCOME BACK {UserService.getUserInfo().name.toUpperCase()}!
            </h4>
          </Alert>
        )}
        <Row noGutters>
          <Col sm="8" className="page-title">
            <h1>NETWORK INFORMATION</h1>
          </Col>
          <Col sm="4" className="d-flex justify-content-end cta-buttons">
            <Dropdown className="cta">
              <Dropdown.Toggle variant="primary" id="dropdown-basic">
                <span>
                  Apps
                  <FontAwesomeIcon
                    className="icon"
                    icon={faAngleDown}
                    color={STYLING.primaryColor}
                  />
                </span>
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
              <Dropdown.Toggle
                className="pl-4 pr-4"
                variant="primary"
                id="dropdown-basic"
              >
                <span>
                  Nodes
                  <FontAwesomeIcon
                    className="icon"
                    icon={faAngleDown}
                    color={STYLING.primaryColor}
                  />
                </span>
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
        <Row className="stats mb-4" noGutters>
          {CARDS.map((card, idx) => (
            <Col key={idx} className="stat-column" md={2}>
              <InfoCard title={card.title} subtitle={card.subtitle} />
            </Col>
          ))}
        </Row>
        <div className="network-status-tables">
          <Row className="network-status-tables-row">
            <Col sm="6" className="network-status-table">
              <Segment scroll={false} label="Registered Nodes">
                <AppTable
                  scroll
                  classes="flex-body"
                  headerClasses="d-flex"
                  toggle={userNodes.length > 0}
                  keyField="pocketNode.publicPocketAccount.address"
                  data={userNodes}
                  columns={TABLE_COLUMNS.NODES}
                  bordered={false}
                />
              </Segment>
            </Col>
            <Col sm="6" className="network-status-table">
              <Segment scroll={false} label="Registered Apps">
                <AppTable
                  scroll
                  classes="flex-body"
                  headerClasses="d-flex"
                  toggle={userApps.length > 0}
                  keyField="pocketApplication.id"
                  data={userApps}
                  columns={TABLE_COLUMNS.APPS}
                  bordered={false}
                />
              </Segment>
            </Col>
          </Row>
          <Row>
            <Col
              sm="12"
              className={`network-status-table ${
                chains.length === 0 ? "segment-table-empty" : ""
              }`}
            >
              <Segment scroll={false} label="Supported Blockchains">
                <AppTable
                  keyField="hash"
                  scroll
                  toggle={chains.length > 0}
                  data={chains}
                  columns={TABLE_COLUMNS.NETWORK_CHAINS}
                  bordered={false}
                />
              </Segment>
            </Col>
            <Col
              sm="12"
              className={`network-status-table ${
                chains.length === 0 ? "segment-table-empty" : ""
              }`}
            >
              <Segment scroll={false} label="Most popular chains">
                <AppTable
                  keyField="hash"
                  scroll
                  toggle={chains.length > 0}
                  data={chains}
                  columns={TABLE_COLUMNS.NETWORK_CHAINS}
                  bordered={false}
                />
              </Segment>
            </Col>
          </Row>
        </div>
      </div>
    );
  }
}

export default Dashboard;
