import React, {Component} from "react";
import {Container, Col, Row} from "react-bootstrap";
import AppSidebar from "./AppSidebar/AppSidebar";
import AppNavbar from "./AppNavbar/AppNavbar";
import Breadcrumbs from "./Breadcrumb";
import Dashboard from "../../../views/Dashboard/Dashboard";

class DefaultLayout extends Component {
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
                  {url: "#1", label: "DefaultLayout", active: false},
                  {url: "#2", label: "Overview", active: true},
                ]}
              />
            </Row>
            <Row>
              <Dashboard />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DefaultLayout;
