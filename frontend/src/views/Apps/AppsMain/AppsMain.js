import React, {Component} from "react";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "./AppsMain.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";
import {APPLICATIONS_LIMIT, BONDSTATUS} from "../../../constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../components/Main/Main";

class AppsMain extends Main {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ...this.state,
      registeredApps: [],
      userApps: [],
      filteredUserApps: [],
      totalApplications: 0,
      averageStaked: 0,
      averageRelays: 0,
      loading: true,
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

  render() {
    const {
      filteredUserApps,
      totalApplications,
      averageStaked,
      averageRelays,
      registeredApps,
      loading,
    } = this.state;

    const columns = [
      {
        dataField: "pocketApplication.name",
        text: "Name",
      },
      {
        dataField: "networkData.address",
        text: "Address",
      },
    ];

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
            <Button variant="secondary" size={"md"} className="pl-4 pr-4">
              Import app
            </Button>
          </Col>
        </Row>
        <Row className="stats mb-4">
          <InfoCards cards={cards}></InfoCards>
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
                <p style={{fontWeight: "bold", fontSize: "1.2em"}}>Order by:</p>
                {/* TODO: Implement sorting on apps */}
                <AppDropdown
                  onSelect={(t) => console.log(t)}
                  options={["All", "Newest", "Oldest"]}
                />
              </Col>
            </Row>
            <div className="main-list">
              {filteredUserApps.map((app, idx) => {
                const {name, icon} = app.pocketApplication;
                const {staked_tokens, status} = app.networkData;

                // TODO: Add network information
                return (
                  <PocketElementCard
                    key={idx}
                    title={name}
                    subtitle={`Staked POKT: ${staked_tokens} POKT`}
                    status={BONDSTATUS[status]}
                    iconURL={icon}
                  />
                );
              })}
            </div>
          </Col>
          <Col sm="4" md="4" lg="4">
            <h2>Registered apps</h2>
            <div className="order-by">
              <p style={{fontWeight: "bold", fontSize: "1.2em"}}>Order by:</p>
              {/* TODO: Implement sorting on apps */}
              <AppDropdown
                onSelect={(t) => console.log(t)}
                options={["All", "Newest", "Oldest"]}
              />
            </div>
            <BootstrapTable
              classes="table app-table table-striped"
              keyField="networkData.address"
              data={registeredApps}
              columns={columns}
              bordered={false}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppsMain;
