export const Configurations = {
  backendUrl: process.env.REACT_APP_BACKEND_URL,
  payment: {
    default: {
      client_id: process.env.REACT_APP_PAYMENT_DEFAULT_CLIENT_ID,
      options: {}
    }
  }
};
