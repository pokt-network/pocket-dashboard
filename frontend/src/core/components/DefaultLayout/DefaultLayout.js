import React, {Component} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Redirect, Route} from "react-router-dom";
import AppSidebar from "./AppSidebar/AppSidebar";
import AppNavbar from "./AppNavbar/AppNavbar";
import Breadcrumbs from "./Breadcrumb";
import {dashboardRoutes, ROUTE_PATHS} from "../../../_routes";
import UserService from "../../services/PocketUserService";

class DefaultLayout extends Component {
  render() {
    // eslint-disable-next-line react/prop-types
    const {path} = this.props.match;

    if (!UserService.isLoggedIn()) {
      return <Redirect to={ROUTE_PATHS.login}/>;
    }

    return (
      <Container fluid className={"auth-page"}>
        <Row>
          <AppSidebar/>
          <Col>
            <AppNavbar/>
            <Row>
              {/* TODO: Remove manually written links for testing purposes */}
              <Breadcrumbs
                links={[{url: "#", label: "Network Status", active: true}]}
              />
            </Row>
            <div className={"pl-4 pr-4"}>
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
            </div>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DefaultLayout;
