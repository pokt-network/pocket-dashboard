import BaseService from "./BaseService";
import {get_default_payment_provider} from "../providers/payment";
import BasePaymentProvider from "../providers/payment/BasePaymentProvider";

export default class PaymentService extends BaseService {

  constructor() {
    super();

    /** @type {BasePaymentProvider} */
    this._paymentProvider = get_default_payment_provider();
  }

  async __makePoktPayment() {
  }

  async makePoktPaymentForNodes() {
  }

  async makePoktPaymentForApps() {
  }

  async getPaymentHistory() {
  }
}
