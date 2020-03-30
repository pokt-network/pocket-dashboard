import React, {Component} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Route} from "react-router-dom";
import AppSidebar from "./AppSidebar/AppSidebar";
import AppNavbar from "./AppNavbar/AppNavbar";
import Breadcrumbs from "./Breadcrumb";
import {dashboardRoutes} from "../../../_routes";

class DefaultLayout extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const {path} = this.props.match;

    return (
      <Container fluid className={"Auth-page"}>
        <Row>
          <AppSidebar/>
          <Col>
            <AppNavbar/>
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

export default DefaultLayout;
