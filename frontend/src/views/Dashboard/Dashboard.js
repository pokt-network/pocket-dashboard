import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import AppTable from "../../core/components/Table/Table";

class Dashboard extends Component {
  render() {
    return (
      // <div>
      //   <h1>User</h1>
      //   <div>
      //     <div>Name:</div>
      //     <div>{UserService.getUserInfo().name}</div>
      //     <div>Email:</div>
      //     <div>{UserService.getUserInfo().email}</div>
      //   </div>
      // </div>

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
    );
  }
}

export default Dashboard;
