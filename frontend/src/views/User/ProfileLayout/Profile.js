import React, {Component} from "react";
import "./Profile.scss";
import {Col, Row} from "react-bootstrap";
import ProfileSidebar from "../ProfileSidebar/ProfileSidebar";

class Profile extends Component {
  state = {};
  render() {
    return (
      <div>
        <Row className="mt-5">
          <Col lg={4} md={4} sm={4}>
            <ProfileSidebar />
          </Col>
          <Col lg={8} md={8} sm={8}></Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
