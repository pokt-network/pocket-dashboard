import BaseService from "./BaseService";
import {get_default_payment_provider} from "../providers/payment";

export default class PaymentService extends BaseService {

  constructor() {
    super();

    /** @type {BasePaymentProvider} */
    this._paymentProvider = get_default_payment_provider();
  }

  async __makePoktPayment() {

  }

  async __closePoktPayment() {

  }

  async makePoktPaymentForNodes() {

  }

  async makePoktPaymentForApps() {

  }

  async getPaymentHistory() {

  }
}
