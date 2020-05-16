import React, {Component} from "react";
import Sidebar from "../../Sidebar";
import {Row} from "react-bootstrap";
import MenuItem from "./MenuItem/MenuItem";
import "./AppSidebar.scss";
import navRoutes from "../../../../_nav";
import {isActiveExactUrl} from "../../../../_helpers";

class AppSidebar extends Component {
  render() {
    return (
      <Sidebar xs={2} sm={2} lg={2} className="app-sidebar">
        <Row>
          <ul className="sidebar-menu">
            {navRoutes.items.map((route, idx) => (
              <MenuItem
                key={idx}
                label={route.name}
                url={route.url}
                icon={route.icon}
                isActive={isActiveExactUrl}
              />
            ))}
          </ul>
        </Row>
      </Sidebar>
    );
  }
}

export default AppSidebar;
