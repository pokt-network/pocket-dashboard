import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";

// Configure Environment Variables: Now .env files can be loaded and used in process.env.
dotenv.config();

export const Configurations = {
  payment: {
    default: {
      client_id: process.env.PAYMENT_DEFAULT_CLIENT_ID,
      client_secret: process.env.PAYMENT_DEFAULT_CLIENT_SECRET,
      options: {}
    },
    test: {
      client_id: process.env.TEST_PAYMENT_DEFAULT_CLIENT_ID,
      client_secret: process.env.TEST_PAYMENT_DEFAULT_CLIENT_SECRET,
      options: {}
    }
  },
  auth: {
    providers: {
      google: {
        client_id: process.env.AUTH_PROVIDER_GOOGLE_CLIENT_ID,
        client_secret: process.env.AUTH_PROVIDER_GOOGLE_CLIENT_SECRET,
        callback_url: process.env.AUTH_PROVIDER_GOOGLE_CALLBACK_URL,
        scopes: ["https://www.googleapis.com/auth/userinfo.email", "https://www.googleapis.com/auth/userinfo.profile"]
      },
      github: {
        client_id: process.env.AUTH_PROVIDER_GITHUB_CLIENT_ID,
        client_secret: process.env.AUTH_PROVIDER_GITHUB_CLIENT_SECRET,
        callback_url: process.env.AUTH_PROVIDER_GITHUB_CALLBACK_URL,
        scopes: ["read:user", "user:email"],
        urls: {
          consent_url: "https://github.com/login/oauth/authorize",
          access_token: "https://github.com/login/oauth/access_token",
          user_info_url: "https://api.github.com/user"
        }
      }
    }
  },
  email: {
    api_key: process.env.EMAIL_API_KEY,
    from_email: "dashboard@pokt.network"
  },
  persistence: {
    default: {
      url: process.env.DATABASE_URL,
      db_name: process.env.DATABASE_NAME,
      options: {
        useUnifiedTopology: true
      }
    },
    test: {
      url: "mongodb://localhost:27017",
      db_name: "pocket_dashboard_test",
      options: {
        useUnifiedTopology: true
      }
    }
  },
  pocket_network: {
    aat_version: "0.0.1",
    default_rpc_port: 8081,
    transaction_fee: "100000",
    chain_id: "pocket-testnet-rc-0.2.1",
    max_dispatchers: process.env.POCKET_NETWORK_MAX_DISPATCHER,
    request_timeout: process.env.POCKET_NETWORK_REQUEST_TIMEOUT,
    max_sessions: process.env.POCKET_NETWORK_MAX_SESSIONS,
    free_tier: {
      account: process.env.POCKET_FREE_TIER_ACCOUNT,
      stake_amount: process.env.POCKET_FREE_TIER_AMOUNT,
    },
    nodes: {
      test_rpc_provider: "http://node4.testnet.pokt.network",
      test: [
        "http://node1.testnet.pokt.network",
        "http://node2.testnet.pokt.network",
        "http://node3.testnet.pokt.network",
        "http://node4.testnet.pokt.network",
        "http://node5.testnet.pokt.network",
        "http://node6.testnet.pokt.network",
        "http://node7.testnet.pokt.network",
        "http://node8.testnet.pokt.network",
        "http://node9.testnet.pokt.network",
        "http://node10.testnet.pokt.network"
      ],
      rpc_provider: "http://node4.testnet.pokt.network",
      main: [
        "http://node1.testnet.pokt.network",
        "http://node2.testnet.pokt.network",
        "http://node3.testnet.pokt.network",
        "http://node4.testnet.pokt.network",
        "http://node5.testnet.pokt.network",
        "http://node6.testnet.pokt.network",
        "http://node7.testnet.pokt.network",
        "http://node8.testnet.pokt.network",
        "http://node9.testnet.pokt.network",
        "http://node10.testnet.pokt.network"
      ]
    }
  }
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
