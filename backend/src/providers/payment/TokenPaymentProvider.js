import BasePaymentProvider, {
  CardPaymentMethod,
  PaymentResult,
} from "./BasePaymentProvider";
import { v4 as uuidv4 } from "uuid";
import { providerType } from "./Index";

class TokenPaymentProvider extends BasePaymentProvider {
  constructor(paymentProviderConfiguration) {
    super(paymentProviderConfiguration);
  }

  async createPaymentIntent(
    userCustomerID,
    type,
    currency,
    item,
    amount,
    description = "",
    tokens
  ) {
    let paymentData = {
      amount: amount,
      payment_method_types: [type],
      currency,
      metadata: {
        "pocket account": item.account,
        name: item.name,
        type: item.type,
        pokt: item.pokt,
        tokens: tokens,
      },
      setup_future_usage: "on_session",
      customer: userCustomerID,
    };

    if (description) {
      paymentData["description"] = description;
    }

    const date = new Date();

    return new PaymentResult(
      uuidv4(),
      date,
      "",
      "pokt",
      tokens,
      providerType.token
    );
  }

  async createCustomer(user) {
    return {
      id: uuidv4(),
    };
  }
}

export default TokenPaymentProvider;
