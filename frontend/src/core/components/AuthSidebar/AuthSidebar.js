import React, { Component } from "react";
import { Row } from "react-bootstrap";
import Sidebar from "../Sidebar";
import "./AuthSidebar.scss";

export default class AuthSidebar extends Component {
  render() {
    return (
      <Sidebar sm={3}>
        <map name="workmap">
          <area target="_blank" shape="rect" coords="0,0,115,45" alt="Pocket" href="https://pokt.network" />
          <area shape="rect" coords="125,0,238,43" alt="Dashboard" href={`${window.location.origin}/login`} />
        </map>
        <img
          id="logo-white"
          className="white"
          src="/assets/logo-dashboard-white.svg"
          alt="logo"
          useMap="#workmap"
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
              This tool provides a simple way to interact, purchase,
              <br />
              and stake with Pocket Network, using real-time network
              <br />
              information to manage app and nodes.
            </p>
          </Row>
        </div>
      </Sidebar>
    );
  }
}
