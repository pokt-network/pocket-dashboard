export const PaymentCurrencies = {
    usd: "usd"
};

export const PaymentTypes = {
    card: "card"
};

export class PaymentRecipient {

    /**
     * @param {string} name Name of Recipient.
     * @param {string} [email] Email address that the receipt for the resulting payment will be sent to.
     * @param {string} [number] Number of Recipient.
     */
    constructor(name, email, number) {
        Object.assign(this, {name, email, number});
    }
}

export class PaymentResult {

    /**
     * @param {string} id ID of payment.
     * @param {Date} createdDate Date of creation of payment.
     * @param {string} paymentNumber Confirmation number of payment.
     * @param {string} currency Currency of payment.
     * @param {number} amount Amount of payment.
     */
    constructor(id, createdDate, paymentNumber, currency, amount) {
        Object.assign(this, {createdDate, amount, currency, paymentNumber});
    }
}

export default class BasePaymentProvider {

    /**
     * @param {object} paymentProviderConfiguration Payment provider configuration.
     * @param {string} paymentProviderConfiguration.client_id Client ID of Payment provider.
     * @param {string} paymentProviderConfiguration.client_secret Client secret of Payment provider.
     * @param {object} paymentProviderConfiguration.options Extra Options of payment provider.
     */
    constructor(paymentProviderConfiguration) {
        this._paymentProviderConfiguration = paymentProviderConfiguration;
    }

    /**
     * Create an intent of payment.
     *
     * @param {string} type Type of payment.
     * @param {string} currency Three-letter ISO currency code, in lowercase.
     * @param {number} amount Amount intended to be collected by this payment.
     * @param {string} description An arbitrary string attached to the object. Often useful for displaying to users.
     *
     * @returns {Promise<PaymentResult>} Payment result.
     * @async
     * @abstract
     */
    async createPaymentIntent(type, currency, amount, description) {
    }
}
