import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import NewCardPaymentMethodForm from "../../core/components/Payment/Stripe/NewCardPaymentMethodForm";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Welcome back {UserService.getUserInfo().name}</h1>

        {/*TODO: Remove this element when finish.*/}
        <NewCardPaymentMethodForm paymentIntentID={"pi_1GXxByFF1uO1aFOlXDgxNOZj_secret_WlUhD7ThcYd1LgxTrpkzKsIBY"}/>
      </div>
    );
  }
}

export default Dashboard;
