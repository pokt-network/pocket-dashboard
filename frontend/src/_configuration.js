export const Configurations = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  secureLS: {
    encodingType: "aes",
    isCompression: false,
    encryptionSecret: process.env.REACT_APP_SECURE_LS_SECRET,
  },
  payment: {
    default: {
      client_id: process.env.REACT_APP_PAYMENT_DEFAULT_CLIENT_ID,
      options: {},
    },
  },
  recaptcha: {
    client: process.env.REACT_APP_RECAPTCHA_CLIENT_KEY,
  },
  pocket_network: {
    max_dispatchers: process.env.REACT_APP_POCKET_NETWORK_MAX_DISPATCHER,
    max_sessions: process.env.REACT_APP_POCKET_NETWORK_MAX_SESSIONS,
    request_timeout: process.env.REACT_APP_POCKET_NETWORK_REQUEST_TIMEOUT,
    dispatchers: process.env.REACT_APP_POCKET_NETWORK_DISPATCHERS,
    transaction_fee: "100000",
    chain_id: process.env.REACT_APP_POCKET_NETWORK_CHAIN_ID,
  },
};
