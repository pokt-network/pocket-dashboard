import React, {Component} from "react";
import "./Profile.scss";
import {Col, Row} from "react-bootstrap";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";
import {Route} from "react-router-dom";
import {profileRoutes} from "../../../_routes";

class Profile extends Component {
  state = {};
  render() {
    // eslint-disable-next-line react/prop-types
    const {path} = this.props.match;

    return (
      <div>
        <Row className="mt-5">
          <Col lg={4} md={4} sm={4}>
            <ProfileSidebar />
          </Col>
          <Col lg={8} md={8} sm={8}>
            {profileRoutes.map((route, idx) => {
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
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
