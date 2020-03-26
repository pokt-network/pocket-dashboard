import React, {Component} from "react";
import AppNavbar from "../../core/components/Dashboard/AppNavbar/AppNavbar";
import UserService from "../../core/services/PocketUserService";
import {Container, Col, Row} from "react-bootstrap";
import AppSidebar from "../../core/components/Dashboard/AppSidebar/AppSidebar";
import Breadcrumbs from "../../core/components/Dashboard/Breadcrumb";

class Dashboard extends Component {
  render() {
    return (
      <Container fluid className={"auth-page"}>
        <Row>
          <AppSidebar />
          <Col>
            <AppNavbar />
            <Row>
              {/* TODO: Remove manually written links for testing purposes */}
              <Breadcrumbs
                links={[
                  {url: "#", label: "Home", active: false},
                  {url: "#1", label: "Dashboard", active: false},
                  {url: "#2", label: "Overview", active: true},
                ]}
              />
            </Row>
            <Row>
              <div>
                <h1>User</h1>
                <div>
                  <div>Name:</div>
                  <div>{UserService.getUserInfo().name}</div>
                  <div>Email:</div>
                  <div>{UserService.getUserInfo().email}</div>
                </div>
              </div>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
