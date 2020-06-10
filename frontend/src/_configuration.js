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
    free_tier: {
      account: process.env.REACT_APP_POCKET_FREE_TIER_ACCOUNT,
      passphrase: process.env.REACT_APP_POCKET_FREE_TIER_ACCOUNT_PASSPRHASE,
      stake_amount: process.env.REACT_APP_POCKET_FREE_TIER_STAKE_AMOUNT,
    }
  },
  stakeDefaultStatus: process.env.REACT_APP_STAKE_DEFAULT_STATUS,
  defaultMaxRelaysPerDay: process.env.REACT_APP_DEFAULT_MAX_RELAYS_PER_DAY
};
