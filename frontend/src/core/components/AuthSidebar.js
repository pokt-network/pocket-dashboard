import React, {Component} from "react";
import {Row} from "react-bootstrap";
import Sidebar from "./Sidebar";

export default class AuthSidebar extends Component {
  render() {

    return (
      <Sidebar xs={2} sm={3} lg={3} >
        <div id="auth-sidebar" style={{paddingLeft: 60}}>
        <Row id={"title"}>
          <h1>
            We are <br/>
            pocket <br/>
            network
          </h1>
        </Row>
        <Row>
          <p>
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            Pocket Network's mission is to ensure the sustainable <br/>
            Decentralization of blockchain infrastructure. In a <br/>
            market that is over-reliant on single-service provider.
          </p>
        </Row>
        </div>
      </Sidebar>
    );
  }
}

