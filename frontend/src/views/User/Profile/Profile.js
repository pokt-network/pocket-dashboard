import React, {Component} from "react";
import "./Profile.scss";
import MenuProfile from "../MenuProfile/MenuProfile";
import {Col, Row} from "react-bootstrap";

class Profile extends Component {
  state = {};
  render() {
    return (
      <div>
        <Row className="mt-5">
          <Col lg={4} md={4} sm={4}>
            <MenuProfile />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Profile;
