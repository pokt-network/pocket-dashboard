import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./apis/_helpers";
import jwt from "express-jwt";
import UserService from "./services/UserService";
import { DashboardValidationError } from "./models/Exceptions";

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
      expiration: process.env.JWT_EXPIRATION,
      refresh_expiration: process.env.JWT_REFRESH_EXPIRATION,
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
      StakeNode: "d-f660d1ebfe7249308129c3c46fc2bd14",
      UnstakeNode: "d-32f6e4d914064ca49cdda0dfac7518f8",
      CreateOrImportApp: "d-b24fb0e9349f402bb173d1b370875e54",
      AppDeleted: "d-7dbd41a3f2d447c68669a3ccfad91d69",
      StakeApp: "d-326ce2d17e054522aa7e2ccfdba7d4b6",
      UnstakeApp: "d-43a51e9535a94c8c96a8546212115c3b",
      PaymentCompletedApp: "d-524c799dd69741d08da0b461193f8f56",
      PaymentCompletedNode: "d-30be85ce84d843d6ba894de5989d26c9",
      PaymentDeclined: "d-dd1a7b11445f471184beb8024f637d75",
      PasswordReset: "d-4e4ea689c9d1446581aa086bbc409fdd",
    },
  },
  persistence: {
    default: {
      url: process.env.DATABASE_URL,
      db_name: process.env.DATABASE_NAME,
      db_encryption_key: process.env.DATABASE_ENCRYPTION_KEY,
      options: {
        useUnifiedTopology: true,
      },
    },
    test: {
      url: "mongodb://localhost:27017",
      db_name: "pocket_dashboard_test",
      db_encryption_key: process.env.DATABASE_ENCRYPTION_KEY,
      options: {
        useUnifiedTopology: true,
      },
    },
  },
  pocket_network: {
    jobs: {
      database_url: process.env.POCKET_NETWORK_SERVICE_WORKER_DATABASE_URL,
      delayed_time:
        process.env.POCKET_NETWORK_SERVICE_WORKER_DELAYED_START_TIME,
      attempts: process.env.POCKET_NETWORK_SERVICE_WORKER_ATTEMPTS,
    },
    aat_version: process.env.POCKET_NETWORK_AAT_VERSION,
    transaction_fee: process.env.POCKET_NETWORK_TRANSACTION_FEE,
    chain_id: process.env.POCKET_NETWORK_CHAIN_ID,
    max_dispatchers: process.env.POCKET_NETWORK_MAX_DISPATCHER,
    request_timeout: process.env.POCKET_NETWORK_REQUEST_TIMEOUT,
    max_sessions: process.env.POCKET_NETWORK_MAX_SESSIONS,
    pokt_market_price: process.env.POKT_USD_MARKET_PRICE,
    max_usd_value: process.env.CHECKOUT_MAX_USD_VALUE,
    checkout: {
      pokt_market_price: process.env.POKT_USD_MARKET_PRICE,
      max_usd_value: process.env.CHECKOUT_MAX_USD_VALUE,
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
      stake_amount: process.env.POCKET_FREE_TIER_STAKE_AMOUNT,
      max_relay_per_day_amount:
        process.env.POCKET_FREE_TIER_MAX_RELAY_PER_DAY_AMOUNT,
      fund_account: process.env.POCKET_NETWORK_FREE_TIER_FUND_ACCOUNT,
      fund_address: process.env.POCKET_NETWORK_FREE_TIER_FUND_ADDRESS,
      client_pub_key: process.env.POCKET_NETWORK_CLIENT_PUB_KEY,
    },
    dispatchers: process.env.POCKET_NETWORK_DISPATCHERS,
    chain_hash: process.env.POCKET_NETWORK_CHAIN_HASH,
    provider_type: process.env.POCKET_NETWORK_PROVIDER_TYPE,
    http_provider_node: process.env.POCKET_NETWORK_HTTP_PROVIDER_NODE,
    main_fund_account: process.env.POCKET_NETWORK_MAIN_FUND_ACCOUNT,
    main_fund_address: process.env.POCKET_NETWORK_MAIN_FUND_ADDRESS,
  },
  recaptcha: {
    google_server: process.env.RECAPTCHA_SERVER_SECRET,
  },
  aws: {
    access_key_id: process.env.AWS_ACCESS_KEY_ID,
    secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
    s3_fts_bucket: process.env.AWS_S3_FTS_BUCKET,
  },
};

/**
 * @param {object} expressApp Express application object.
 */
export function configureExpress(expressApp) {
  const userService = new UserService();
  const excludedPathList = [
    "/api/users/validate-token",
    "/api/users/exists",
    "/api/users/auth/login",
    "/api/users/auth/signup",
    "/api/users/auth/providers",
    "/api/users/auth/providers/login",
    "/api/users/auth/resend-signup-email",
    "/api/users/auth/is-validated",
    "/api/users/auth/reset-password",
    "/api/users/auth/send-reset-password-email",
    "/api/users/auth/verify-captcha",
    "/api/security_questions/user/validate-answers",
    "/api/security_questions/user/all",
    "/api/security_questions/answered",
    "login",
  ];

  expressApp.use(express.json());
  expressApp.use(
    express.urlencoded({
      extended: false,
    })
  );
  expressApp.use(cookieParser());
  expressApp.use(logger("dev"));
  expressApp.use(
    cors({
      exposedHeaders: ["Authorization"],
    })
  );
  // JWT getToken for custom auth headers
  expressApp.use(
    jwt({
      secret: Configurations.auth.jwt.secret_key,
      algorithms: ["HS256"],
      getToken: function fromHeader(req) {
        if (req.headers.authorization) {
          let accessToken;

          if (
            req.headers.authorization.split(", ")[0].split(" ")[0] === "Token"
          ) {
            accessToken = req.headers.authorization
              .split(", ")[0]
              .split(" ")[1];
          }

          return accessToken;
        }

        return null;
      },
    }).unless({
      path: excludedPathList,
    })
  );

  expressApp.use(async function (err, req, res, next) {
    // Try to renew the session if expired
    if (err.message === "jwt expired") {
      // Try to get new session tokens using the refresh token
      if (
        req.headers.authorization.split(", ")[1].split(" ")[0] === "Refresh" &&
        req.headers.authorization.split(", ")[2].split(" ")[0] === "Email"
      ) {
        const refreshToken = req.headers.authorization
          .split(", ")[1]
          .split(" ")[1];
        const userEmail = req.headers.authorization
          .split(", ")[2]
          .split(" ")[1];

        if (refreshToken && userEmail) {
          const newSessionTokens = await userService.renewSessionTokens(
            refreshToken,
            userEmail
          );

          if (newSessionTokens instanceof DashboardValidationError) {
            throw newSessionTokens;
          }

          // Update the auth headers with the new tokens
          res.set(
            "Authorization",
            `Token ${newSessionTokens.accessToken}, Refresh ${newSessionTokens.refreshToken}, Email ${userEmail}`
          );
        }
      } else {
        res.status(401).send("Token expired, please sign in again.");
      }
    }

    // Check if the request contains an email, meaning a change or private data is being requested
    if (req.body && req.body.email && !excludedPathList.includes(req.path)) {
      if (
        !(await userService.verifySessionForClient(
          req.headers.authorization,
          req.body.email
        ))
      ) {
        res.send({
          success: false,
          data: "Account doesn't belong to the client.",
        });
      }
    }
    next();
  });
}

/**
 * @param {object} expressApp Express application object.
 */
export function handleErrors(expressApp) {
  expressApp.use(errorHandler);
}
