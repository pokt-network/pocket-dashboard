import express from 'express';
import {configureRoutes} from './_routes';
import {configureExpress} from './_configuration';

import webpack from 'webpack';
import webPackConfig from '../webpack.config'
import webpackDevMiddleware from 'webpack-dev-middleware';
import dotenv from 'dotenv';

const webPackCompiler = webpack(webPackConfig);
const app = express();

// Configure Environment Variables: Now .env files can be loaded and used in process.env .
dotenv.config();

configureRoutes(app);
configureExpress(app);

// Tell express to use the webpack-dev-middleware and use the webpack.config.js
// configuration file as a base.
app.use(webpackDevMiddleware(webPackCompiler, {
  publicPath: webPackConfig.output.publicPath
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`App listening to ${PORT}....`);
  console.log('Press Ctrl+C to quit.');
});
