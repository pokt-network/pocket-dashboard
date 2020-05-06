import React from "react";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "./AppsMain.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import {
  APPLICATIONS_LIMIT,
  BOND_STATUS_STR,
  TABLE_COLUMNS,
  FILTER_OPTIONS,
} from "../../../_constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../../core/components/Main/Main";
import {
  formatNumbers,
  mapStatusToField,
  getBondStatus,
} from "../../../_helpers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faBoxOpen} from "@fortawesome/free-solid-svg-icons";
import Segment from "../../../core/components/Segment/Segment";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";
import overlayFactory from "react-bootstrap-table2-overlay";
import LoadingOverlay from "react-loading-overlay";

class AppsMain extends Main {
  constructor(props, context) {
    super(props, context);

    this.handleAllItemsFilter = this.handleAllItemsFilter.bind(this);
    this.handleUserItemsFilter = this.handleUserItemsFilter.bind(this);

    this.state = {
      ...this.state,
      hasApps: false,
    };
  }

  async componentDidMount() {
    const userEmail = UserService.getUserInfo().email;

    const userItems = await ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT
    );

    const {
      totalApplications,
      averageRelays,
      averageStaked,
    } = await ApplicationService.getStakedApplicationSummary();

    const registeredItems = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT
    );

    this.setState({
      userItems,
      filteredItems: userItems,
      total: totalApplications,
      averageRelays,
      averageStaked,
      registeredItems,
      loading: false,
      hasApps: userItems.length > 0,
    });
  }

  async handleAllItemsFilter(option) {
    this.setState({allItemsTableLoading: true});

    const registeredItems = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT, 0, BOND_STATUS_STR[option]
    );

    this.setState({registeredItems, allItemsTableLoading: false});
  }

  async handleUserItemsFilter(option) {
    this.setState({userItemsTableLoading: true});

    const userEmail = UserService.getUserInfo().email;

    const userItems = await ApplicationService.getAllUserApplications(
      userEmail, APPLICATIONS_LIMIT, 0, BOND_STATUS_STR[option]
    );

    this.setState({
      userItems,
      filteredItems: userItems,
      userItemsTableLoading: false,
    });
  }

  render() {
    const {
      filteredItems,
      total,
      averageStaked,
      averageRelays,
      registeredItems: allregisteredItems,
      loading,
      allItemsTableLoading,
      userItemsTableLoading,
      hasApps,
    } = this.state;

    const registeredItems = allregisteredItems.map(mapStatusToField);

    const cards = [
      {title: formatNumbers(total), subtitle: "Total of apps"},
      {title: formatNumbers(averageStaked), subtitle: "Average staked"},
      {
        title: formatNumbers(averageRelays),
        subtitle: "Average relays per application",
      },
    ];

    const userAppsDropdown = (
      <AppDropdown
        onSelect={(status) => this.handleUserItemsFilter(status.dataField)}
        options={FILTER_OPTIONS}
      />
    );

    const allAppsDropdown = (
      <AppDropdown
        onSelect={(status) => this.handleAllItemsFilter(status.dataField)}
        options={FILTER_OPTIONS}
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
            className="d-flex justify-content-end"
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
                <LoadingOverlay active={userItemsTableLoading} spinner>
                  {hasApps ? (
                    filteredItems.map((app, idx) => {
                      const {name, icon} = app.pocketApplication;
                      const {stakedTokens, status} = app.networkData;
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
                            subtitle={`Staked POKT: ${stakedTokens} POKT`}
                            status={getBondStatus(status)}
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
                classes="app-table table-striped"
                keyField="pocketApplication.publicPocketAccount.address"
                data={registeredItems}
                columns={TABLE_COLUMNS.APPS}
                bordered={false}
                loading={allItemsTableLoading}
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
