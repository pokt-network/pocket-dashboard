import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from "App";
import env from "environment";

const REACT_AXE_THROTTLE_TIME = 1000;

Sentry.init({
  dsn: env("PROD") ? env("SENTRY_DSN") : "",
  integrations: [new Integrations.BrowserTracing()],

  tracesSampleRate: 1.0,
});

// react-axe is a package that lets us test the a11y of all the components in the app.
// We don't want to run it in prod, so we do a runtime check. to not even import the package
// if it's not needed.
if (!env("PROD")) {
  const axe = require("@axe-core/react");

  axe(React, ReactDOM, REACT_AXE_THROTTLE_TIME);
}

ReactDOM.render(<App />, document.getElementById("root"));
