import React, {Component} from "react";
import {Row} from "react-bootstrap";
import Sidebar from "../Sidebar";
import "./AuthSidebar.scss";

export default class AuthSidebar extends Component {
  render() {
    return (
      <Sidebar sm={3}>
        <img
          src="/assets/logo-dashboard-white.svg"
          id="logo-white"
          alt=""
          className="white"
        />
        <div id="auth-sidebar">
          <Row>
            <h1>
              POCKET <br />
              NETWORK <br />
              DASHBOARD
            </h1>
          </Row>
          <Row>
            <p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              In a market over-reliant on expensive single-service
              <br />
              providers, Pocket Network offers a decentralized
              <br />
              alternative that&#39;s much more cost-effective and resilient.
            </p>
          </Row>
        </div>
      </Sidebar>
    );
  }
}
