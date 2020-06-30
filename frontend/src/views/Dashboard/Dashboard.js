import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import {Alert, Col, Dropdown, Row} from "react-bootstrap";
import "./Dashboard.scss";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../_routes";
import InfoCard from "../../core/components/InfoCard/InfoCard";
import {
  APPLICATIONS_LIMIT,
  NODES_LIMIT,
  STYLING,
  TABLE_COLUMNS,
  BACKEND_ERRORS,
  DEFAULT_NETWORK_ERROR_MESSAGE
} from "../../_constants";
import NetworkService from "../../core/services/PocketNetworkService";
import Loader from "../../core/components/Loader";
import ApplicationService from "../../core/services/PocketApplicationService";
import NodeService from "../../core/services/PocketNodeService";
import {formatCurrency, formatNumbers, mapStatusToField, formatNetworkData} from "../../_helpers";
import Segment from "../../core/components/Segment/Segment";
import {faAngleDown} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import AppTable from "../../core/components/AppTable";
import AppAlert from "../../core/components/AppAlert";

class Dashboard extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      welcomeAlert: true,
      loading: true,
      chains: [],
      networkApps: [],
      networkNodes: [],
      summary: [],
      error: {show: false, message: ""},
    };
  }

  async componentDidMount() {
    let hasError = false;
    let errorMessage = "";
    let errorType = "";

    const {
      poktPrice,
      totalStakedTokens,
      totalStakedApps,
      totalStakedNodes,
      error,
      name,
      message,
    } = await NetworkService.getNetworkSummaryData();

    hasError = error ? error : hasError;
    errorMessage = error ? message : errorMessage;
    errorType = error ? name : errorType;

    const networkApps = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT);

    hasError = networkApps.error ? networkApps.error : hasError;
    errorMessage = networkApps.error ? networkApps.message : errorMessage;
    errorType = networkApps.error ? networkApps.name : errorType;

    const networkNodes = await NodeService.getAllNodes(NODES_LIMIT);

    hasError = networkNodes.error ? networkNodes.error : hasError;
    errorMessage = networkNodes.error ? networkNodes.message : errorMessage;
    errorType = networkNodes.error ? networkNodes.name : errorType;
    
    const chains = await NetworkService.getAvailableNetworkChains();
    const welcomeAlert = UserService.getShowWelcomeMessage();

    if (welcomeAlert) {
      UserService.showWelcomeMessage(false);
    }

    if (errorType === BACKEND_ERRORS.NETWORK) {
      errorMessage = DEFAULT_NETWORK_ERROR_MESSAGE;
    }

    this.setState({
      welcomeAlert,
      networkApps,
      networkNodes,
      error: {show: hasError, message: errorMessage},
      chains,
      summary: [
        {title: `US ${formatCurrency(poktPrice)}`, subtitle: "POKT Price"},
        {
          title: formatNetworkData(totalStakedTokens),
        titleAttrs: {title: totalStakedTokens ? formatNumbers(totalStakedTokens) : undefined},
          subtitle: "Total Staked Tokens",
        },
        {
          title: formatNumbers(totalStakedNodes),
          subtitle: "Total Staked nodes",
        },
        {title: formatNumbers(totalStakedApps), subtitle: "Total Staked apps"},
      ],
      loading: false,
    });
  }

  render() {
    const {
      welcomeAlert,
      chains,
      loading,
      networkApps: allnetworkApps,
      networkNodes: allnetworkNodes,
      summary,
      error,
    } = this.state;

    if (loading) {
      return <Loader />;
    }

    const networkApps = allnetworkApps.map(mapStatusToField);
    const networkNodes = allnetworkNodes.map(mapStatusToField);

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
        {error.show && (
          <AppAlert
            variant="danger"
            title={error.message}
            dismissible
            onClose={() => this.setState({error: {show: false}})}
          />
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
          {summary.map((card, idx) => (
            <Col key={idx} className="stat-column" md={3}>
              <InfoCard titleAttrs={card.titleAttrs} title={card.title} subtitle={card.subtitle} />
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
                  toggle={networkNodes.length > 0}
                  keyField="address"
                  data={networkNodes}
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
                  toggle={networkApps.length > 0}
                  keyField="pocketApplication.id"
                  data={networkApps}
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
