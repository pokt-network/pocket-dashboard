import React from "react";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "./AppsMain.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";
import {
  APPLICATIONS_LIMIT,
  BOND_STATUS,
  BOND_STATUS_STR,
} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../../core/components/Main/Main";
import {mapStatusToApp} from "../../../_helpers";
import overlayFactory from "react-bootstrap-table2-overlay";
import LoadingOverlay from "react-loading-overlay";

class AppsMain extends Main {
  constructor(props, context) {
    super(props, context);

    this.handleAllAppsFilter = this.handleAllAppsFilter.bind(this);
    this.handleUserAppsFilter = this.handleUserAppsFilter.bind(this);

    this.state = {
      ...this.state,
      registeredApps: [],
      userApps: [],
      filteredUserApps: [],
      totalApplications: 0,
      averageStaked: 0,
      averageRelays: 0,
      loading: true,
      allAppsTableLoading: false,
      userAppsTableLoading: false,
    };
  }

  async componentDidMount() {
    const userEmail = UserService.getUserInfo().email;

    const userApps = await ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT
    );

    const {
      totalApplications,
      averageRelays,
      averageStaked,
    } = await ApplicationService.getStakedApplicationSummary();

    const registeredApps = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT
    );

    this.setState({
      userApps,
      filteredUserApps: userApps,
      totalApplications,
      averageRelays,
      averageStaked,
      registeredApps,
      loading: false,
    });
  }

  async handleAllAppsFilter(option) {
    this.setState({allAppsTableLoading: true});

    const registeredApps = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT, 0, BOND_STATUS_STR[option]
    );

    this.setState({registeredApps, allAppsTableLoading: false});
  }

  async handleUserAppsFilter(option) {
    this.setState({userAppsTableLoading: true});

    const userEmail = UserService.getUserInfo().email;

    const userApps = await ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT, 0, BOND_STATUS_STR[option]
    );

    this.setState({
      userApps,
      filteredUserApps: userApps,
      userAppsTableLoading: false,
    });
  }

  render() {
    const {
      filteredUserApps,
      totalApplications,
      averageStaked,
      averageRelays,
      registeredApps: allRegisteredApps,
      loading,
      allAppsTableLoading,
      userAppsTableLoading,
    } = this.state;

    const columns = [
      {
        dataField: "pocketApplication.name",
        text: "Name",
      },
      {
        dataField: "pocketApplication.publicPocketAccount.address",
        text: "Address",
      },
      {
        dataField: "networkData.status",
        text: "Status",
      },
    ];

    const registeredApps = allRegisteredApps.map(mapStatusToApp);

    const cards = [
      {title: totalApplications, subtitle: "Total of apps"},
      {title: averageStaked, subtitle: "Average staked"},
      {title: averageRelays, subtitle: "Average relays per application"},
    ];

    if (loading) {
      return <Loader />;
    }

    return (
      <div>
        <Row>
          <Col sm="8" md="8" lg="8">
            <h2 className="ml-1">General Apps Information</h2>
          </Col>
          <Col
            sm="4"
            md="4"
            lg="4"
            className="d-flex justify-content-end general-info"
          >
            <Link to={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}>
              <Button
                variant="dark"
                size={"md"}
                className="ml-4 pl-4 pr-4 mr-3"
              >
                Create new app
              </Button>
            </Link>
            <Link to={_getDashboardPath(DASHBOARD_PATHS.importApp)}>
              <Button variant="secondary" size={"md"} className="pl-4 pr-4">
                Import app
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className="stats mb-4">
          <InfoCards cards={cards} />
        </Row>
        <Row className="mb-4">
          <Col sm="8" md="8" lg="8">
            <h2 className="mb-3">My apps</h2>
            <Row>
              <Col sm="8" md="8" lg="8">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Search app"
                    name="searchQuery"
                    onChange={this.handleChange}
                    onKeyPress={({key}) => {
                      if (key === "Enter") {
                        this.handleAppSearch();
                      }
                    }}
                  />
                  <InputGroup.Append>
                    <Button
                      type="submit"
                      onClick={this.handleAppSearch}
                      variant="dark"
                    >
                      Search
                    </Button>
                  </InputGroup.Append>
                </InputGroup>
              </Col>
              <Col sm="4" md="4" lg="4" className="order-by">
                <p style={{fontWeight: "bold", fontSize: "1.2em"}}>
                  Filter by:
                </p>
                {/* TODO: Implement sorting on apps */}
                <AppDropdown
                  onSelect={(status) =>
                    this.handleUserAppsFilter(status.dataField)
                  }
                  options={[
                    {text: "Bonded", dataField: "bonded"},
                    {text: "Unbonding", dataField: "unbonding"},
                    {text: "Unbonded", dataField: "unbonded"},
                  ]}
                />
              </Col>
            </Row>
            <div className="main-list">
              <LoadingOverlay active={userAppsTableLoading} spinner>
                {filteredUserApps.map((app, idx) => {
                  const {name, icon} = app.pocketApplication;
                  const {staked_tokens, status} = app.networkData;

                  // TODO: Add network information
                  return (
                    <PocketElementCard
                      key={idx}
                      title={name}
                      subtitle={`Staked POKT: ${staked_tokens} POKT`}
                      status={BOND_STATUS[status]}
                      iconURL={icon}
                    />
                  );
                })}
              </LoadingOverlay>
            </div>
          </Col>
          <Col sm="4" md="4" lg="4">
            <h2>Registered apps</h2>
            <div className="order-by">
              <p style={{fontWeight: "bold", fontSize: "1.2em"}}>Filter by:</p>
              <AppDropdown
                onSelect={(status) =>
                  this.handleAllAppsFilter(status.dataField)
                }
                options={[
                  {text: "Bonded", dataField: "bonded"},
                  {text: "Unbonding", dataField: "unbonding"},
                  {text: "Unbonded", dataField: "unbonded"},
                ]}
              />
            </div>
            <BootstrapTable
              classes="table app-table table-striped"
              keyField="pocketApplication.publicPocketAccount.address"
              data={registeredApps}
              columns={columns}
              bordered={false}
              loading={allAppsTableLoading}
              noDataIndication={"No apps found"}
              overlay={overlayFactory({
                spinner: true,
                styles: {
                  overlay: (base) => ({
                    ...base,
                    background: "rgba(0, 0, 0, 0.2)",
                  }),
                },
              })}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppsMain;
