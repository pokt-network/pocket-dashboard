import express from "express";
import {configureRoutes} from "./_routes";
import {configureExpress, handleErrors} from "./_configuration";

import webpack from "webpack";
import webPackConfig from "../webpack.config";
import webpackDevMiddleware from "webpack-dev-middleware";
import "./Jobs";


const webPackCompiler = webpack(webPackConfig);
const app = express();

configureExpress(app);
configureRoutes(app);
handleErrors(app);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(webPackCompiler, {
  publicPath: webPackConfig.output.publicPath
}));

//
app.use(function(req, res, next) {
  if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No authorization header is present!' });
  }

  next();
});

const PORT = process.env.PORT || 4200;

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening to ${PORT}....`);
  // eslint-disable-next-line no-console
  console.log("Press Ctrl+C to quit.");
});
