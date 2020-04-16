import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import SaveAndPayForm from "../../core/components/Payment/Stripe/SaveAndPayForm";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Welcome back {UserService.getUserInfo().name}</h1>

        {/*TODO: Remove this element when finish.*/}
        <SaveAndPayForm paymentIntentSecretID={"pi_1GYBKBFF1uO1aFOlMpQcgxwb_secret_BHgA7vXWkpHkEFHK6fG3by7qc"}/>
      </div>
    );
  }
}

export default Dashboard;
