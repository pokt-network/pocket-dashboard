import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import {errorsHandler} from "./apis/_helpers";

// Configure Environment Variables: Now .env files can be loaded and used in process.env.
dotenv.config();

export const Configurations = {
         payment: {
           default: {
             client_id: process.env.PAYMENT_DEFAULT_CLIENT_ID,
             client_secret: process.env.PAYMENT_DEFAULT_CLIENT_SECRET,
             options: {},
           },
           test: {
             client_id: process.env.TEST_PAYMENT_DEFAULT_CLIENT_ID,
             client_secret: process.env.TEST_PAYMENT_DEFAULT_CLIENT_SECRET,
             options: {},
           },
         },
         auth: {
           jwt: {
             secret_key: process.env.JWT_SECRET_KEY,
           },
           providers: {
             google: {
               client_id: process.env.AUTH_PROVIDER_GOOGLE_CLIENT_ID,
               client_secret: process.env.AUTH_PROVIDER_GOOGLE_CLIENT_SECRET,
               callback_url: process.env.AUTH_PROVIDER_GOOGLE_CALLBACK_URL,
               scopes: [
                 "https://www.googleapis.com/auth/userinfo.email",
                 "https://www.googleapis.com/auth/userinfo.profile",
               ],
             },
             github: {
               client_id: process.env.AUTH_PROVIDER_GITHUB_CLIENT_ID,
               client_secret: process.env.AUTH_PROVIDER_GITHUB_CLIENT_SECRET,
               callback_url: process.env.AUTH_PROVIDER_GITHUB_CALLBACK_URL,
               scopes: ["read:user", "user:email"],
               urls: {
                 consent_url: "https://github.com/login/oauth/authorize",
                 access_token: "https://github.com/login/oauth/access_token",
                 user_info_url: "https://api.github.com/user",
               },
             },
           },
         },
         email: {
           api_key: process.env.EMAIL_API_KEY,
           from_email: process.env.EMAIL_FROM,
           template_ids: {
             SignUp: "d-7c3bdbf20cb842eebc2ee076078b2f69",
             EmailChanged: "d-7c3bdbf20cb842eebc2ee076078b2f69",
             PasswordChanged: "d-de0b42109c4f48b98ea27203c59fc233",
             CreateOrImportNode: "d-b12c1a006ab34e3ba6a480bbb4137a1a",
             NodeDeleted: "d-d557d6aa6b94474fae2d4b70c27cd3ab",
             NodeUnJailed: "d-6f96b3e8ec3b48a6a232953f924927b8",
             StakeNode: "d-30be85ce84d843d6ba894de5989d26c9",
             UnstakeNode: "d-32f6e4d914064ca49cdda0dfac7518f8",
             CreateOrImportApp: "d-b24fb0e9349f402bb173d1b370875e54",
             AppDeleted: "d-7dbd41a3f2d447c68669a3ccfad91d69",
             StakeApp: "d-524c799dd69741d08da0b461193f8f56",
             UnstakeApp: "d-43a51e9535a94c8c96a8546212115c3b",
             PaymentDeclined: "d-dd1a7b11445f471184beb8024f637d75",
           },
         },
         persistence: {
           default: {
             url: process.env.DATABASE_URL,
             db_name: process.env.DATABASE_NAME,
             options: {
               useUnifiedTopology: true,
             },
           },
           test: {
             url: "mongodb://localhost:27017",
             db_name: "pocket_dashboard_test",
             options: {
               useUnifiedTopology: true,
             },
           },
         },
         pocket_network: {
           jobs: {
             database_url:
               process.env.POCKET_NETWORK_SERVICE_WORKER_DATABASE_URL,
             delayed_time:
               process.env.POCKET_NETWORK_SERVICE_WORKER_DELAYED_START_TIME,
             attempts: process.env.POCKET_NETWORK_SERVICE_WORKER_ATEMPTS,
           },
           aat_version: "0.0.1",
           transaction_fee: "100000",
           chain_id: process.env.POCKET_NETWORK_CHAIN_ID,
           max_dispatchers: process.env.POCKET_NETWORK_MAX_DISPATCHER,
           request_timeout: process.env.POCKET_NETWORK_REQUEST_TIMEOUT,
           max_sessions: process.env.POCKET_NETWORK_MAX_SESSIONS,
           pokt_market_price: process.env.POKT_MARKET_PRICE,
           checkout: {
             default_currency: process.env.CHECKOUT_DEFAULT_CURRENCY,
             relays_per_day: {
               min: process.env.CHECKOUT_MIN_RELAYS_PER_DAY,
               max: process.env.CHECKOUT_MAX_RELAYS_PER_DAY,
               base_relay_per_pokt: process.env.CHECKOUT_BASE_RELAY_PER_POKT,
             },
             validator_power: {
               min: process.env.CHECKOUT_MIN_VALIDATOR_POWER,
               max: process.env.CHECKOUT_MAX_VALIDATOR_POWER,
             },
             stability: process.env.CHECKOUT_STABILITY,
             sessions_per_day: process.env.CHECKOUT_SESSIONS_PER_DAY,
             p_rate: process.env.CHECKOUT_P_RATE,
           },
           free_tier: {
             account: process.env.POCKET_FREE_TIER_ACCOUNT,
             passphrase: process.env.POCKET_FREE_TIER_ACCOUNT_PASSPRHASE,
             stake_amount: process.env.POCKET_FREE_TIER_STAKE_AMOUNT,
           },
           nodes: {
             test_rpc_provider: "http://localhost",
             test: [
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
             ],
             rpc_provider: "http://localhost",
             main: [
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
               "http://localhost",
             ],
           },
           dispatchers: process.env.POCKET_NETWORK_DISPATCHERS,
           chain_hash: process.env.POCKET_NETWORK_CHAIN_HASH,
           dashboard_aat: {
             client_priv_key: process.env.POCKET_NETWORK_AAT_CLIENT_PRIV_KEY,
             client_priv_key_passphrase:
               process.env.POCKET_NETWORK_AAT_CLIENT_PASSPHRASE,
             app_priv_key: process.env.POCKET_NETWORK_AAT_APP_PRIV_KEY,
           },
           provider_type: "http",
           http_provider_node: "https://node1.testnet.pokt.network:443",
           main_fund_account:
             "b4d0d4933d4ccdd5faf5a19457d7485c9605664c3ea71e26d6c2c96b19ad6f94e603378f4c0fe1ca57d545741a8150231218aa3d9e2f62c06a5005dfbca3bf3d",
           main_fund_address: "cad3b0b8f5b54f0750385c6ca17a5c745d9dba17"
         },
         recaptcha: {
           google_server: process.env.RECAPTCHA_SERVER_SECRET,
         },
       };

/**
 * @param {object} expressApp Express application object.
 */
export function configureExpress(expressApp) {
  expressApp.use(express.json());
  expressApp.use(express.urlencoded({extended: false}));
  expressApp.use(cookieParser());
  expressApp.use(logger("dev"));
  expressApp.use(cors());
}

/**
 * @param {object} expressApp Express application object.
 */
export function handleErrors(expressApp) {
  expressApp.use(errorsHandler);
}
