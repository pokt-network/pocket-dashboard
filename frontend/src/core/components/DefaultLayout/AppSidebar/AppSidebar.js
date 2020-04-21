import React, {Component} from "react";
import Sidebar from "../../Sidebar";
import {Row} from "react-bootstrap";
import MenuItem from "./MenuItem/MenuItem";
import "./AppSidebar.scss";
import navRoutes from "../../../../_nav";
import {DASHBOARD_PATHS} from "../../../../_routes";

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

                  // When user is on a profile-related view, set the sidebar
                  // link to active.
                  if (match.url.includes(DASHBOARD_PATHS.profile)) {
                    return true;
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
