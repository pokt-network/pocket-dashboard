import BasePaymentProvider, {CardPaymentMethod, PaymentResult} from "./BasePaymentProvider";
import PocketService from "../../services/PocketService";
import {v4 as uuidv4} from "uuid";
import {Configurations} from "../../_configuration";
import {CoinDenom} from "@pokt-network/pocket-js";

const crypto = require("crypto");

class TokenPaymentProvider extends BasePaymentProvider {

    constructor(paymentProviderConfiguration) {
        super(paymentProviderConfiguration);

        this.pocketService = new PocketService();
    }

    async createPaymentIntent(address, passphrase, userCustomerID, type, currency, item, amount, description = "", tokens) {

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
                address: address,
                passphrase: passphrase,
            },
            setup_future_usage: "on_session",
            customer: userCustomerID
        };

        if (description) {
            paymentData["description"] = description;
        }

        const { chain_id: chainID, transaction_fee: transactionFee } = Configurations.pocket_network;

        const transactionSender = await this.pocketService._getTransactionSender(address, passphrase);
        await transactionSender.send(address, '', tokens).submit(chainID, transactionFee, CoinDenom.Upokt)

        return new PaymentResult(uuidv4(), date, "", "pokt", tokens);
    }

    async createCustomer(user) {
        return {
            "id": uuidv4()
        };
    }
}

export default TokenPaymentProvider;
