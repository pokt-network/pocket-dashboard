import React from "react";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "./AppsMain.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import {APPLICATIONS_LIMIT, BOND_STATUS, STYLING} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../../core/components/Main/Main";
import {formatNumbers, mapStatusToApp} from "../../../_helpers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faBoxOpen} from "@fortawesome/free-solid-svg-icons";
import Segment from "../../../core/components/Segment/Segment";
import {BOND_STATUS_STR} from "../../../_constants";
import overlayFactory from "react-bootstrap-table2-overlay";
import LoadingOverlay from "react-loading-overlay";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";

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
      hasApps: false,
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
      hasApps: userApps.length > 0
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
      totalApplications,
      averageStaked,
      filteredUserApps,
      averageRelays,
      registeredApps: allRegisteredApps,
      loading,
      allAppsTableLoading,
      userAppsTableLoading,
      hasApps,
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
        style: {
          color: STYLING.primaryColor,
          fontWeight: "bold",
        },
      },
    ];

    const registeredApps = allRegisteredApps.map(mapStatusToApp);

    const cards = [
      {title: formatNumbers(totalApplications), subtitle: "Total of apps"},
      {title: formatNumbers(averageStaked), subtitle: "Average staked"},
      {
        title: formatNumbers(averageRelays),
        subtitle: "Average relays per application",
      },
    ];

    const filterOptions = [
      {text: "Bonded", dataField: "bonded"},
      {text: "Unbonding", dataField: "unbonding"},
      {text: "Unbonded", dataField: "unbonded"},
    ];

    const userAppsDropdown = (
      <AppDropdown
        onSelect={(status) => this.handleUserAppsFilter(status.dataField)}
        options={filterOptions}
      />
    );

    const allAppsDropdown = (
      <AppDropdown
        onSelect={(status) => this.handleAllAppsFilter(status.dataField)}
        options={filterOptions}
      />
    );

    if (loading) {
      return <Loader />;
    }

    return (
      <div>
        <Row>
          <Col sm="8" md="8" lg="8">
            <h1 className="ml-1">General Apps Information</h1>
          </Col>
          <Col
            sm="4"
            md="4"
            lg="4"
            className="d-flex justify-content-end general-info"
          >
            <Link to={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}>
              <Button variant="dark" className="ml-4 pl-4 pr-4 mr-3">
                Create New App
              </Button>
            </Link>
            <Link to={_getDashboardPath(DASHBOARD_PATHS.importApp)}>
              <Button variant="primary" size={"md"} className="pl-4 pr-4">
                Import app
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className="stats mb-4">
          <InfoCards cards={cards} />
        </Row>
        <Row className="mb-4">
          <Col sm="6" md="6" lg="6">
           <Segment
              label="MY APPS"
              sideItem={hasApps ? userAppsDropdown : undefined}
            >
              <InputGroup className="search-input mb-3">
                <FormControl
                  placeholder="Search app"
                  name="searchQuery"
                  onChange={this.handleChange}
                  onKeyPress={({key}) => {
                    if (key === "Enter") {
                      this.handleSearch();
                    }
                  }}
                />
                <InputGroup.Append>
                  <Button
                    type="submit"
                    onClick={this.handleSearch}
                    variant="outline-primary"
                  >
                    <FontAwesomeIcon icon={faSearch} />
                  </Button>
                </InputGroup.Append>
              </InputGroup>
              <div className="main-list">
                <LoadingOverlay active={userAppsTableLoading} spinner>
                  {hasApps ? (
                    filteredUserApps.map((app, idx) => {
                      const {name, icon} = app.pocketApplication;
                      const {staked_tokens, status} = app.networkData;
                      const {
                        address,
                      } = app.pocketApplication.publicPocketAccount;

                      // TODO: Add network information
                      return (
                        <Link
                          key={idx}
                          to={() => {
                            const url = _getDashboardPath(
                              DASHBOARD_PATHS.appDetail
                            );

                            return url.replace(":address", address);
                          }}
                        >
                          <PocketElementCard
                            title={name}
                            subtitle={`Staked POKT: ${staked_tokens} POKT`}
                            status={BOND_STATUS[status]}
                            iconURL={icon}
                          />
                        </Link>
                      );
                    })
                  ) : (
                    <div className="empty-overlay">
                      <FontAwesomeIcon
                        className="icon"
                        size="7x"
                        icon={faBoxOpen}
                      />
                      <p>
                        You have not created or <br /> imported any app yet!
                      </p>
                    </div>
                  )}
                </LoadingOverlay>
              </div>
            </Segment>
          </Col>
          <Col sm="6" md="6" lg="6">
            <Segment label="REGISTERED APPS" sideItem={allAppsDropdown}>
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
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppsMain;
