/**
 * @param {{query:object}} request Request.
 * @param {string} option Option.
 *
 * @returns {string} Query option value.
 */
export function getQueryOption(request, option) {
  const parsedData = request.query;

  // eslint-disable-next-line no-prototype-builtins
  if (!parsedData.hasOwnProperty(option)) {
    throw Error(`${option} query parameter is required.`);
  }

  if (parsedData[option] === undefined) {
    throw Error(`${option} query parameter cannot be null.`);
  }

  return parsedData[option];
}

/**
 * @param {{query:object}} request Request.
 * @param {string} option Option.
 *
 * @returns {string} Query option value.
 */
export function getOptionalQueryOption(request, option) {
  const parsedData = request.query;

  // eslint-disable-next-line no-prototype-builtins
  if (!parsedData.hasOwnProperty(option)) {
    return "";
  }

  if (parsedData[option] === undefined) {
    return "";
  }

  return parsedData[option];
}

// https://strongloop.com/strongblog/async-error-handling-expressjs-es7-promises-generators/
export const apiAsyncWrapper = fn => (...args) => fn(...args).catch(args[2]);

/**
 * Handle API errors.
 *
 * @param {*} error Error to handler.
 * @param {*} req Request.
 * @param {*} res Response.
 * @param {*} next Next object.
 */
export function errorsHandler(error, req, res, next) {

  switch (error.name) {
    case "PocketNetworkError":
      res.status(408); //  Request Timeout.
      break;
    case "DashboardError":
    case "DashboardValidationError":
      res.status(400); // Bad request.
      break;
  }

  const {message, name} = error;

  res.json({message, name});
  next();
}
