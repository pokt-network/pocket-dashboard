import React, {Component} from "react";
import Sidebar from "../../Sidebar";
import {Row} from "react-bootstrap";
import MenuItem from "./MenuItem/MenuItem";
import "./AppSidebar.scss";
import navRoutes from "../../../../_nav";

class AppSidebar extends Component {
  render() {
    return (
      <Sidebar xs={2} sm={2} lg={2}>
        <Row>
          <ul id="app-sidebar" className="sidebar-menu">
            {navRoutes.items.map((route, idx) => (
              <MenuItem
                key={idx}
                label={route.name}
                url={route.url}
                icon={route.icon}
                isActive={(match, location) => {
                  if (!match) {
                    return false;
                  }

                  return match.url === location.pathname;
                }}
              />
            ))}
          </ul>
        </Row>
      </Sidebar>
    );
  }
}

export default AppSidebar;
