import BasePaymentProvider, {ITEM_TYPES, PaymentResult} from "./BasePaymentProvider";
import PocketService from "../../services/PocketService";
import {v4 as uuidv4} from "uuid";
import {Configurations} from "../../_configuration";
import {CoinDenom} from "@pokt-network/pocket-js";

class TokenPaymentProvider extends BasePaymentProvider {

    constructor(paymentProviderConfiguration) {
        super(paymentProviderConfiguration);

        this.pocketService = new PocketService();
    }

    async createPaymentIntent(metadata, userCustomerID, type, currency, item, amount, description = "", tokens) {

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
            customer: userCustomerID
        };

        if (description) {
            paymentData["description"] = description;
        }

        const {chain_id: chainID, transaction_fee: transactionFee} = Configurations.pocket_network;

        const transactionSender = metadata.txSender;
        const {unlockedAccount: account} = transactionSender;

        if (type === ITEM_TYPES.NODE) {
            await transactionSender
                .nodeStake(
                    account.publicKey.toString("hex"), metadata.chains, tokens, new URL(metadata.serviceURL)
                )
                .createTransaction(chainID, transactionFee);
        } else {
            await transactionSender
                .appStake(
                    account.publicKey.toString("hex"), metadata.chainID, tokens
                )
                .createTransaction(chainID, transactionFee);
        }
        
        return new PaymentResult(uuidv4(), new Date(), "", "pokt", tokens);
    }

    async createCustomer(user) {
        return {
            "id": uuidv4()
        };
    }
}

export default TokenPaymentProvider;
