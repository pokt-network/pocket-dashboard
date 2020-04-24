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
      options: {}
    }
  }
};
