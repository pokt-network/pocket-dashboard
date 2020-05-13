import React, {Component} from "react";
import {Link} from "react-router-dom";
import AppAlert from "./AppAlert";
import {_getDashboardPath, DASHBOARD_PATHS} from "../../_routes";

class UnauthorizedAlert extends Component {
  state = {};
  render() {
    return (
      <AppAlert variant="danger" title={<h4>Unauthorized page</h4>}>
        <p>
          You&#39;re not allowed to be on this page.{" "}
          <Link to={_getDashboardPath(DASHBOARD_PATHS.home)}>
            Go back to dashboard.
          </Link>
        </p>
      </AppAlert>
    );
  }
}

export default UnauthorizedAlert;
