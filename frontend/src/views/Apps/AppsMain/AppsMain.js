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
    this.handleuserItemsFilter = this.handleuserItemsFilter.bind(this);

    this.state = {
      ...this.state,
      userItems: [],
      filteredItems: [],
      total: 0,
      averageStaked: 0,
      averageRelays: 0,
      loading: true,
      allItemsTableLoading: false,
      userItemsTableLoading: false,
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
    });
  }

  async handleAllAppsFilter(option) {
    this.setState({allItemspsTableLoading: true});

    const registeredItems = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT, 0, BOND_STATUS_STR[option]
    );

    this.setState({registeredItems, allItemspsTableLoading: false});
  }

  async handleuserItemsFilter(option) {
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

    const registeredItems = allregisteredItems.map(mapStatusToApp);

    const cards = [
      {title: total, subtitle: "Total of apps"},
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
            <Button variant="secondary" size={"md"} className="pl-4 pr-4">
              Import app
            </Button>
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
                        this.handleSearch("pocketApplication.name");
                      }
                    }}
                  />
                  <InputGroup.Append>
                    <Button
                      type="submit"
                      onClick={() =>
                        this.handleSearch("pocketApplication.name")
                      }
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
                    this.handleuserItemsFilter(status.dataField)
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
              <LoadingOverlay active={userItemsTableLoading} spinner>
                {filteredItems.map((app, idx) => {
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
              data={registeredItems}
              columns={columns}
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppsMain;
