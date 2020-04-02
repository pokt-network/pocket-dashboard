import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import AppTable from "../../core/components/Table/Table";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Welcome back {UserService.getUserInfo().name}</h1>

        // TODO: Remove this component for demostration purposes
        <AppTable
          columns={["#", "First Name", "Last Name", "username"]}
          columnData={[
            ["1", "Mark", "Twain", "@mark"],
            ["2", "Omar", "Zach", "@omar"],
            ["3", "Olivan", "Wells", "@olivan"],
          ]}
          handleSelect={data => console.log(data)}
        />
      </div>


    );
  }
}

export default Dashboard;
