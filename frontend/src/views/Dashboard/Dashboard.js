import React, {Component} from "react";
import UserService from "../../core/services/PocketUserService";
import Payment from "../../core/components/Payment/Payment";
import {CardElement} from "@stripe/react-stripe-js";

class Dashboard extends Component {
  render() {
    return (
      <div>
        <h1>Welcome back {UserService.getUserInfo().name}</h1>

        {/*TODO: Remove this element when finish.*/}
        <Payment>
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
                invalid: {
                  color: "#9e2146",
                },
              },
            }}
          />
        </Payment>
      </div>
    );
  }
}

export default Dashboard;
