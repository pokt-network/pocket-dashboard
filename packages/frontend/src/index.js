import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from "./App";
import env from "./environment";

const REACT_AXE_THROTTLE_TIME = 1000;

Sentry.init({
  dsn: env("ENABLE_SENTRY") ? env("SENTRY_DSN") : "",
  integrations: [new Integrations.BrowserTracing()],

  tracesSampleRate: 1.0,
});

if (!env("PROD")) {
  const axe = require("@axe-core/react");

  axe(React, ReactDOM, REACT_AXE_THROTTLE_TIME);
}

ReactDOM.render(<App />, document.getElementById("root"));
