import React from "react";
import ReactDOM from "react-dom";
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
import App from "./App";
import { Configurations } from "./_configuration";
import "./index.scss";

Sentry.init({
  dsn: Configurations.sentryDsn,
  integrations: [new Integrations.BrowserTracing()],

  tracesSampleRate: 1.0,
});

ReactDOM.render(<App />, document.getElementById("root"));
