import React, {Component} from "react";
import BootstrapTable from "react-bootstrap-table-next";
import "./NodesMain.scss";
import {Button, Col, FormControl, InputGroup, Row} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";
import {APPLICATIONS_LIMIT, BONDSTATUS} from "../../../constants";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../../_routes";
import Loader from "../../../core/components/Loader";

class NodesMain extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleAppSearch = this.handleAppSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      registeredApps: [],
      userNodes: [],
      filteredNodesApps: [],
      totalNodes: 0,
      averageStaked: 0,
      averageRelays: 0,
      loading: true,
      data: {
        searchQuery: "",
      },
    };
  }

  handleChange({currentTarget: input}) {
    const data = {...this.state.data};

    data[input.name] = input.value;
    this.setState({data});
  }

  handleAppSearch() {
    const {userNodes} = this.state;
    const {searchQuery} = this.state.data;

    let filteredNodesApps = userNodes;

    if (searchQuery) {
      filteredNodesApps = userNodes.filter((a) =>
        a.pocketApplication.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase())
      );
    }

    this.setState({filteredNodesApps});
  }

  async componentDidMount() {
    const userEmail = UserService.getUserInfo().email;

    const userNodes = await ApplicationService.getAllUserApplications(
      userEmail,
      APPLICATIONS_LIMIT
    );

    const {
      totalApplications: totalNodes,
      averageRelays,
      averageStaked,
    } = await ApplicationService.getStakedApplicationSummary();

    const registeredApps = await ApplicationService.getAllApplications(
      APPLICATIONS_LIMIT
    );

    this.setState({
      userNodes,
      filteredNodesApps: userNodes,
      totalApplications: totalNodes,
      averageRelays,
      averageStaked,
      registeredApps,
      loading: false,
    });
  }

  render() {
    const {
      filteredNodesApps,
      totalApplications: totalNodes,
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

    if (loading) {
      return <Loader />;
    }

    return (
      <div>
        <Row>
          <Col sm="8" md="8" lg="8">
            <h2 className="ml-1">General Nodes Information</h2>
          </Col>
          <Col
            sm="4"
            md="4"
            lg="4"
            className="d-flex justify-content-end general-info"
          >
            <Button
              href={_getDashboardPath(DASHBOARD_PATHS.createAppInfo)}
              variant="dark"
              size={"md"}
              className="ml-4 pl-4 pr-4 mr-3"
            >
              Create new node
            </Button>
            <Button variant="secondary" size={"md"} className="pl-4 pr-4">
              Import node
            </Button>
          </Col>
        </Row>
        <Row className="stats mb-4">
          <Col>
            <InfoCard title={totalNodes} subtitle="Total of app" />
          </Col>
          <Col>
            <InfoCard title={averageStaked} subtitle="Average staked" />
          </Col>
          <Col>
            <InfoCard
              title={averageRelays}
              subtitle="Average relays per node"
            />
          </Col>
        </Row>
        <Row className="mb-4">
          <Col sm="8" md="8" lg="8">
            <h2 className="mb-3">My nodes</h2>
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
              {filteredNodesApps.map((app, idx) => {
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
            <h2>Registered Nodes</h2>
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

export default NodesMain;
