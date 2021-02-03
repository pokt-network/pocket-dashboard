import React, { Component } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { Redirect, Route } from "react-router-dom";
import AppSidebar from "./AppSidebar/AppSidebar";
import AppNavbar from "./AppNavbar/AppNavbar";
import Banner from "../Banner/Banner";
import Breadcrumbs from "./BreadCrumb/Breadcrumb";
import {
  dashboardRoutes,
  ROUTE_PATHS,
  breadcrumbsRoutes,
} from "../../../_routes";
import UserService from "../../services/PocketUserService";
import "./DefaultLayout.scss";
import isArray from "lodash/isArray";

class DefaultLayout extends Component {
  constructor(props, context) {
    super(props, context);

    this.onBreadCrumbChange = this.onBreadCrumbChange.bind(this);

    this.breadcrumbss = [];

    this.state = {
      breadcrumbs: [],
    };
  }

  onBreadCrumbChange(breadcrumbs) {
    this.setState({ breadcrumbs });
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { path } = this.props.match;
    const { breadcrumbs } = this.state;
    let breadcrumbsShow = breadcrumbs;

    // eslint-disable-next-line react/prop-types
    const route_path = this.props.history.location.pathname.replace(
      ROUTE_PATHS.home,
      ""
    );

    const breadcrumbsMapFn = (br, idx, arr) => {
      return { label: br, active: idx === arr.length - 1 };
    };

    if (route_path in breadcrumbsRoutes()) {
      breadcrumbsShow = breadcrumbsRoutes()[route_path];
    }

    if (isArray(breadcrumbsShow)) {
      breadcrumbsShow = breadcrumbsShow.map(breadcrumbsMapFn);
    } else {
      breadcrumbsShow = [];
    }

    if (!UserService.isLoggedIn()) {
      return <Redirect to={ROUTE_PATHS.login} />;
    }

    return (
      <Container fluid>
        <Banner />
        <Row>
          <AppNavbar />
        </Row>
        <Row>
          <AppSidebar />
          <Col className="default-layout">
            <div className="default-layout-wrapper">
              <Row>
                <Breadcrumbs links={breadcrumbsShow} />
              </Row>
              {dashboardRoutes.map((route, idx) => {
                return (
                  <Route
                    key={idx}
                    path={`${path}${route.path}`}
                    exact={route.exact}
                    name={route.name}
                    render={(props) => (
                      <route.component
                        {...props}
                        onBreadCrumbChange={this.onBreadCrumbChange}
                      />
                    )}
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
