import React from "react";
import {Link} from "react-router-dom";
import BootstrapTable from "react-bootstrap-table-next";
import "./AppsMain.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCards from "../../../core/components/InfoCards";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import {APPLICATIONS_LIMIT, BONDSTATUS, STYLING} from "../../../constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";
import Main from "../../components/Main/Main";
import {formatNumbers} from "../../../_helpers";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch, faBoxOpen} from "@fortawesome/free-solid-svg-icons";
import Segment from "../../../core/components/Segment/Segment";

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
      userEmail,
      APPLICATIONS_LIMIT
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
      totalApplications,
      averageStaked,
      filteredUserApps,
      averageRelays,
      registeredApps: allRegisteredApps,
      loading,
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

    const registeredApps = allRegisteredApps.map((app) => {
      return {
        ...app,
        networkData: {
          ...app.networkData,
          status: BONDSTATUS[app.networkData.status],
        },
      };
    });

    const cards = [
      {title: formatNumbers(totalApplications), subtitle: "Total of apps"},
      {title: formatNumbers(averageStaked), subtitle: "Average staked"},
      {
        title: formatNumbers(averageRelays),
        subtitle: "Average relays per application",
      },
    ];

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
            <Link to={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}>
              <Button variant="primary" className="pl-4 pr-4">
                Import App
              </Button>
            </Link>
          </Col>
        </Row>
        <Row className="stats mb-4">
          <InfoCards cards={cards}></InfoCards>
        </Row>
        <Row className="mb-4">
          <Col sm="6" md="6" lg="6">
            <Segment
              label="MY APPS"
              dropdownOnSelect={(t) => console.log(t)}
              dropdownOptions={[
                {text: "All", dataField: "all"},
                {text: "Newest", dataField: "newest"},
                {text: "Oldest", dataField: "oldest"},
              ]}
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
                {filteredUserApps.length > 0 ? (
                  filteredUserApps.map((app, idx) => {
                    const {name, icon} = app.pocketApplication;
                    const {staked_tokens, status} = app.networkData;
                    const {address} = app.pocketApplication.publicPocketAccount;

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
                          status={BONDSTATUS[status]}
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
              </div>
            </Segment>
          </Col>
          <Col sm="6" md="6" lg="6">
            <Segment
              label="REGISTERED APPS"
              dropdownOnSelect={(t) => console.log(t)}
              dropdownOptions={[
                {text: "All", dataField: "all"},
                {text: "Newest", dataField: "newest"},
                {text: "Oldest", dataField: "oldest"},
              ]}
            >
              <BootstrapTable
                classes="app-table"
                keyField="pocketApplication.publicPocketAccount.address"
                data={registeredApps}
                columns={columns}
                bordered={false}
              />
            </Segment>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AppsMain;
