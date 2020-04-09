import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import NewCardPaymentMethodForm from "../../core/components/Payment/NewCardPaymentMethodForm";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Welcome back {UserService.getUserInfo().name}</h1>

        {/*TODO: Remove this element when finish.*/}
        <NewCardPaymentMethodForm/>
      </div>
    );
  }
}

export default Dashboard;
