import React, {Component} from "react";
import "./AppsMain.scss";
import {Button, Col, Row, InputGroup, FormControl} from "react-bootstrap";
import InfoCard from "../../../core/components/InfoCard/InfoCard";
import PocketElementCard from "../../../core/components/PocketElementCard/PocketElementCard";
import ApplicationService from "../../../core/services/PocketApplicationService";
import UserService from "../../../core/services/PocketUserService";
import AppDropdown from "../../../core/components/AppDropdown/AppDropdown";

const styles = {
  button: {
    fontWeight: "bold",
  },
};

const LIMIT = 10;

class AppsMain extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleAppSearch = this.handleAppSearch.bind(this);
    this.handleChange = this.handleChange.bind(this);

    this.state = {
      userApps: [],
      filteredUserApps: [],
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
    const {userApps} = this.state;
    const {searchQuery} = this.state.data;

    let filteredUserApps = userApps;

    if (searchQuery) {
      filteredUserApps = userApps.filter(a =>
        a.pocketApplication.name
          .toLowerCase()
          .startsWith(searchQuery.toLowerCase())
      );
    }

    this.setState({filteredUserApps});
  }

  async componentDidMount() {
    const userEmail = UserService.getUserInfo().email;

    const userApps = await ApplicationService.getAllUserApplications(
      userEmail,
      LIMIT
    );

    this.setState({userApps, filteredUserApps: userApps});
  }

  render() {
    const {filteredUserApps} = this.state;

    return (
      <React.Fragment>
        <Row>
          <Col sm="8" md="8" lg="8">
            <h2 className="ml-1">General Apps Information</h2>
          </Col>
          <Col sm="4" md="4" lg="4" className="d-flex justify-content-end">
            <Button
              variant="dark"
              size={"md"}
              className="ml-4 pl-4 pr-4 mr-3"
              style={styles.button}
            >
              Create new app
            </Button>
            <Button
              variant="secondary"
              size={"md"}
              className="pl-4 pr-4"
              style={styles.button}
            >
              Import app
            </Button>
          </Col>
        </Row>
        <Row className="stats mb-4">
          <Col>
            <InfoCard title="38,354" subtitle="Total of app" />
          </Col>
          <Col>
            <InfoCard title="1,345" subtitle="Average staked" />
          </Col>
          <Col>
            <InfoCard title="345" subtitle="Average relays per application" />
          </Col>
        </Row>
        <Row>
          <Col sm="8" md="8" lg="8">
            <h2 className="mb-3">My apps</h2>
            <Row>
              <Col sm="8" md="8" lg="8">
                <InputGroup className="mb-3">
                  <FormControl
                    placeholder="Search app"
                    name="searchQuery"
                    onChange={this.handleChange}
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
                  onSelect={t => console.log(t)}
                  options={["All", "Newest", "Oldest"]}
                />
              </Col>
            </Row>
            <div className="apps-list">
              {filteredUserApps.map((app, idx) => {
                const {name, icon} = app.pocketApplication;
                const {staked_tokens, status} = app.networkData;

                // TODO: Add network information
                return (
                  <PocketElementCard
                    key={idx}
                    title={name}
                    subtitle={`Staked POKT: ${staked_tokens} POKT`}
                    status={status.toString()}
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
              {/* TODO: Refactor dropdown to a component */}
              {/* TODO: Implement sorting on apps */}
              <AppDropdown
                onSelect={t => console.log(t)}
                options={["All", "Newest", "Oldest"]}
              />
            </div>
          </Col>
        </Row>
      </React.Fragment>
    );
  }
}

export default AppsMain;
