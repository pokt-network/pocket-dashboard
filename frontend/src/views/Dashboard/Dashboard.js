import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";

class Dashboard extends Component {

  render() {
    return (
      <div>
        <h1>User</h1>
        <div>
          <div>ID:</div>
          <div>{UserService.getUserInfo().id}</div>
          <div>Name:</div>
          <div>{UserService.getUserInfo().name}</div>
          <div>Email:</div>
          <div>{UserService.getUserInfo().email}</div>
          <div>Avatar:</div>
          <div>{UserService.getUserInfo().avatar}</div>
        </div>
      </div>
    );
  }
}

export default Dashboard;

