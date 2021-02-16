const ENV_VARS = {
  ENABLE_SENTRY() {
    return process.env.REACT_APP_ENABLE_SENTRY === "1";
  },
  TIMESCALE_DB_ENDPOINT() {
    return process.env.RECT_APP_TIMESCALEDB_ENDPOINT ?? "";
  },
  SENTRY_DSN() {
    const dsn = process.env.REACT_APP_SENTRY_DSN ?? "";

    return dsn.trim();
  },
  PROD() {
    return process.env.NODE_ENV === "production";
  },
};

export default function env(name) {
  return ENV_VARS[name]();
}
