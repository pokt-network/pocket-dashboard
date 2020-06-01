import React, {Component} from "react";
import {Col, Container, Row} from "react-bootstrap";
import {Redirect, Route} from "react-router-dom";
import AppSidebar from "./AppSidebar/AppSidebar";
import AppNavbar from "./AppNavbar/AppNavbar";
import Breadcrumbs from "./BreadCrumb/Breadcrumb";
import {
  dashboardRoutes,
  ROUTE_PATHS,
  DASHBOARD_PATHS,
  BREADCRUMBS,
  _getDashboardPath,
} from "../../../_routes";
import UserService from "../../services/PocketUserService";
import "./DefaultLayout.scss";

class DefaultLayout extends Component {
  constructor(props, context) {
    super(props, context);

    this.onBreadCrumbChange = this.onBreadCrumbChange.bind(this);

    this.breadcrumbss = [];

    this.state = {
      breadcrumbs: [],
    };
  }

  onBreadCrumbChange() {}

  render() {
    // eslint-disable-next-line react/prop-types
    const {path} = this.props.match;
    let breadcrumbs = [];

    // eslint-disable-next-line react/prop-types
    const route_path = this.props.history.location.pathname.replace(
      ROUTE_PATHS.home,
      ""
    );

    if (route_path in BREADCRUMBS) {
      breadcrumbs = BREADCRUMBS[route_path].map((br, idx) => {
        return {label: br, active: idx === BREADCRUMBS[route_path].length - 1};
      });
    }

    if (!UserService.isLoggedIn()) {
      return <Redirect to={ROUTE_PATHS.login} />;
    }

    return (
      <Container fluid>
        <Row>
          <AppNavbar />
        </Row>
        <Row>
          <AppSidebar />
          <Col className="default-layout">
            <div className="default-layout-wrapper">
              <Row>
                <Breadcrumbs links={breadcrumbs} />
              </Row>
              {dashboardRoutes.map((route, idx) => {
                return (
                  <Route
                    key={idx}
                    path={`${path}${route.path}`}
                    exact={route.exact}
                    name={route.name}
                    component={route.component}
                    onBreadCrumbChange={this.handleBreadCroumb}
                  />
                );
              })}
            </div>
            <Row className="default-layout-footer"></Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default DefaultLayout;
