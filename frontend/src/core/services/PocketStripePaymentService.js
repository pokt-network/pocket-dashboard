import PocketBaseService from "./PocketBaseService";
import PocketUserService from "./PocketUserService";
import axiosInstance from "./_serviceHelper";
const axios = axiosInstance();

class PocketStripePaymentService extends PocketBaseService {

  constructor() {
    super("api/payments");
  }

  /**
   * Mark payment as success on history.
   *
   * @param {string} paymentID Payment intent ID used.
   * @param {string} paymentMethodID Payment method ID to save.
   * @param {object} billingDetails Billing details used on this payment method.
   *
   * @returns {Promise<*>}
   * @private
   */
  async __markPaymentAsSuccess(paymentID, paymentMethodID, billingDetails) {
    const user = PocketUserService.getUserInfo().email;
    const data = { paymentID, user, paymentMethodID, billingDetails };

    return axios.put(this._getURL("history"), data)
      .then(response => response.data);
  }

  /**
   * Save payment method for use later.
   *
   * @param {{id: string, card:{object}}} paymentMethodData Payment method to save.
   * @param {string} paymentMethodData.card.brand Payment method card brand.
   * @param {string} paymentMethodData.card.country Payment method card country.
   * @param {number} paymentMethodData.card.exp_month Payment method card expiration month.
   * @param {number} paymentMethodData.card.exp_year Payment method card expiration year.
   * @param {string} paymentMethodData.card.last4 Payment method card last four digits.
   * @param {object} billingDetails Billing details used on this payment method.
   *
   * @returns {Promise<*>}
   */
  savePaymentMethod(paymentMethodData, billingDetails) {
    const user = PocketUserService.getUserInfo().email;

    const paymentMethod = {
      id: paymentMethodData.id,
      card: {
        brand: paymentMethodData.card.brand,
        country: paymentMethodData.card.country,
        expirationMonth: paymentMethodData.card.exp_month,
        expirationYear: paymentMethodData.card.exp_year,
        lastDigits: paymentMethodData.card.last4
      }
    };

    const data = { paymentMethod, user, billingDetails };

    return axios.post(this._getURL("payment_method"), data)
      .then(response => {
        return { success: true, data: response.data };
      })
      .catch(err => {
        return { success: false, data: err.response.data };
      });
  }

  /**
   * Create a new payment method.
   *
   * @param {object} stripe Stripe object.
   * @param {object} card Card used to confirm payment.
   * @param {{name:string, [address]:{line1:string, [postal_code]:string, country:string}}} billingDetails Billing details about card.
   *
   * @return {Promise<*>}
   * @async
   */
  async createPaymentMethod(stripe, card, billingDetails) {
    if (!stripe || !card) {
      return false;
    }

    const cardData = {
      type: "card",
      card: card,
      billing_details: billingDetails
    };

    return stripe.createPaymentMethod(cardData);
  }

  /**
   * Confirm payment with new card.
   * If payment is success, the payment method will save for later and mark payment success on history.
   *
   * @param {object} stripe Stripe object.
   * @param {string} paymentIntentSecretID Payment intent to confirm.
   * @param {object} card Card used to confirm payment.
   * @param {{name:string, [address]:{line1:string, [postal_code]:string, country:string}}} billingDetails Billing details about card.
   *
   * @return {Promise<*>}
   * @async
   */
  async confirmPaymentWithNewCard(stripe, paymentIntentSecretID, card, billingDetails) {
    if (!stripe || !card) {
      return false;
    }

    const cardPaymentData = {
      payment_method: {
        card,
        billing_details: billingDetails
      },
      setup_future_usage: "on_session"
    };

    return stripe.confirmCardPayment(paymentIntentSecretID, cardPaymentData)
      .then(result => {
        if (result.paymentIntent) {
          const paymentIntent = result.paymentIntent;

          if (paymentIntent.status.toLowerCase() === "succeeded") {
            this.__savePaymentMethod(paymentIntent.payment_method, billingDetails);
            this.__markPaymentAsSuccess(paymentIntent.id, paymentIntent.payment_method, billingDetails);
          }
        }

        return result;
      });
  }

  /**
   * Confirm payment with a saved card.
   *
   * @param {object} stripe Stripe object.
   * @param {string} paymentIntentSecretID Payment intent to confirm.
   * @param {string} paymentMethodID saved card id for purchase.
   * @param {{name:string, [address]:{line1:string, [postal_code]:string,
   *         country:string}}} billingDetails Billing details about card.
   * @return {Promise<*>}
   * @async
   */
  async confirmPaymentWithSavedCard(stripe, paymentIntentSecretID, paymentMethodID, billingDetails) {
    if (!stripe || !paymentIntentSecretID || !paymentMethodID) {
      return false;
    }

    const cardPaymentData = {
      payment_method: paymentMethodID,
      setup_future_usage: "on_session"
    };

    return stripe.confirmCardPayment(paymentIntentSecretID, cardPaymentData).then(result => {
      if (result.paymentIntent) {
        const paymentIntent = result.paymentIntent;

        if (paymentIntent.status.toLowerCase() === "succeeded") {
          this.__markPaymentAsSuccess(paymentIntent.id, paymentIntent.payment_method, billingDetails);
        }
      }

      return result;
    });
  }
}

export default new PocketStripePaymentService();
