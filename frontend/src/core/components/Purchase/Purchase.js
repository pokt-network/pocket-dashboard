import {Component} from "react";
import "./Purchase.scss";

class Purchase extends Component {
  constructor(props, context) {
    super(props, context);

    this.onSliderChange = this.onSliderChange.bind(this);
    this.onCurrentBalanceChange = this.onCurrentBalanceChange.bind(this);
    this.goToSummary = this.goToSummary.bind(this);

    this.state = {
      min: 0,
      max: 0,
      selected: 0,
      type: "",
      purchaseType: "",
      total: 0,
      subTotal: 0,
      originalAccountBalance: 0,
      currentAccountBalance: 0,
      currencies: [],
      loading: true,
      error: {show: false, message: ""},
    };
  }

  validate(currency) {
    const {
      min,
      max,
      selected,
      subTotal,
      total,
      currentAccountBalance,
      originalAccountBalance,
      purchaseType,
    } = this.state;

    if (selected < min || selected > max) {
      throw new Error(`${purchaseType} is not in range allowed.`);
    }

    if (currentAccountBalance < 0) {
      throw new Error("Current balance cannot be minor than 0.");
    }

    if (currentAccountBalance > originalAccountBalance) {
      throw new Error(
        `Current balance cannot be greater than ${originalAccountBalance} ${currency}.`
      );
    }

    if (subTotal <= 0 || isNaN(subTotal)) {
      throw new Error(`${purchaseType} must be a positive value.`);
    }

    if (total <= 0 || isNaN(total)) {
      throw new Error("Total Cost must be a positive value.");
    }

    return true;
  }

  async goToSummary() {}
}

export default Purchase;
