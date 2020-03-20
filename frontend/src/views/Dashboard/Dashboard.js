import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";

class Dashboard extends Component {

  render() {
    return (
      <div>
        <h1>User</h1>
        <div>
          <div>Name:</div>
          <div>{UserService.getUserInfo().name}</div>
          <div>Email:</div>
          <div>{UserService.getUserInfo().email}</div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

