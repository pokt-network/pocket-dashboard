const ENV_VARS = {
  BUILD() {
    return process.env.REACT_APP_BUILD || "undefined";
  },
  PROD() {
    return process.env.NODE_ENV === "production";
  },
  SENTRY_DSN() {
    const dsn = process.env.REACT_APP_SENTRY_DSN ?? "";

    return dsn.trim();
  },
  TIMESCALE_DB_ENDPOINT() {
    return process.env.RECT_APP_TIMESCALEDB_ENDPOINT ?? "";
  },
};

export default function env(name) {
  return ENV_VARS[name]();
}
