import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import CardPaymentMethodForm from "../../core/components/Payment/CardPaymentMethodForm";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Welcome back {UserService.getUserInfo().name}</h1>

        {/*TODO: Remove this element when finish.*/}
        <CardPaymentMethodForm/>
      </div>
    );
  }
}

export default Dashboard;
