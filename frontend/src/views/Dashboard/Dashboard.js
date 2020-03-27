import React, {Component} from "react";
import AppNavbar from "../../core/components/Dashboard/AppNavbar/AppNavbar";
import {Route} from "react-router-dom";
import {Container, Col, Row} from "react-bootstrap";
import AppSidebar from "../../core/components/Dashboard/AppSidebar/AppSidebar";
import Breadcrumbs from "../../core/components/Dashboard/Breadcrumb";
import {dashboardRoutes} from "../../_routes";

class Dashboard extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const {path} = this.props.match;

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
              {dashboardRoutes.map((route, idx) => {
                return (
                  <Route
                    key={idx}
                    path={`${path}${route.path}`}
                    exact={route.exact}
                    name={route.name}
                    component={route.component}
                  />
                );
              })}
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Dashboard;
