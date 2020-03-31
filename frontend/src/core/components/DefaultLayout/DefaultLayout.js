import React, {Component} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Route, Redirect} from "react-router-dom";
import AppSidebar from "./AppSidebar/AppSidebar";
import AppNavbar from "./AppNavbar/AppNavbar";
import Breadcrumbs from "./Breadcrumb";
import {dashboardRoutes, dashboardPaths, routePaths} from "../../../_routes";
import UserService from "../../services/PocketUserService";

class DefaultLayout extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const {path} = this.props.match;

    const {login} = routePaths;

    const {home: dashboardHome} = dashboardPaths;

    if (!UserService.isLoggedIn()) {
      return <Redirect to={login} />;
    }

    return (
      <Container fluid className={"Auth-page"}>
        <Row>
          <AppSidebar />
          <Col>
            <AppNavbar />
            <Row>
              {/* TODO: Remove manually written links for testing purposes */}
              <Breadcrumbs
                links={[{url: "#", label: "Network Status", active: true}]}
              />
            </Row>
            <Row className={"pl-5 pr-5"}>
              {dashboardRoutes.map((route, idx) => {
                return (
                  <Route
                    key={idx}
                    // Removing trailing slash from path to prevent double slashes
                    // eslint-disable-next-line react/prop-types
                    path={`${path.substring(0, path.length - 1)}${route.path}`}
                    exact={route.exact}
                    name={route.name}
                    component={route.component}
                  />
                );
              })}
              <Redirect to={dashboardHome} />
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DefaultLayout;
