import React, {Component} from "react";
import Sidebar from "../../Sidebar";
import {Row} from "react-bootstrap";
import MenuItem from "./MenuItem/MenuItem";
import "./AppSidebar.scss";

class AppSidebar extends Component {
  render() {
    return (
      <Sidebar xs={2} sm={2} lg={2}>
        <Row>
          <ul id="app-sidebar">
            <MenuItem text="Network status" />
            <MenuItem text="Apps" />
            <MenuItem text="Nodes" />
            <MenuItem text="User profile" />
            <MenuItem text="Documentation" />
            <MenuItem text="FAQ" />
          </ul>
        </Row>
      </Sidebar>
    );
  }
}

export default AppSidebar;
