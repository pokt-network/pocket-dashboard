import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Welcome back {UserService.getUserInfo().name}</h1>
      </div>
    );
  }
}

export default Dashboard;
