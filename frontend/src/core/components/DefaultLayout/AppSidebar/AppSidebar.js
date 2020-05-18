import React, {Component} from "react";
import Sidebar from "../../Sidebar";
import {Col, Row} from "react-bootstrap";
import MenuItem from "./MenuItem/MenuItem";
import "./AppSidebar.scss";
import navRoutes from "../../../../_nav";
import {isActiveExactUrl} from "../../../../_helpers";

class AppSidebar extends Component {
  render() {
    const currentYear = new Date().getFullYear();

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
        <Row className="app-sidebar-footer">
          <Col>
            <div className="footer text-center">
              <span className="footer-copyright">
                © {currentYear} Pocket Network Inc
              </span>
            </div>
          </Col>
        </Row>
      </Sidebar>
    );
  }
}

export default AppSidebar;
