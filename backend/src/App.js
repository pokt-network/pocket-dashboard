import express from "express";
import {configureRoutes} from "./_routes";
import {configureExpress} from "./_configuration";

import webpack from "webpack";
import webPackConfig from "../webpack.config";
import webpackDevMiddleware from "webpack-dev-middleware";

const webPackCompiler = webpack(webPackConfig);
const app = express();

configureExpress(app);
configureRoutes(app);


// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(webPackCompiler, {
  publicPath: webPackConfig.output.publicPath
}));

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening to ${PORT}....`);
  // eslint-disable-next-line no-console
  console.log("Press Ctrl+C to quit.");
});
