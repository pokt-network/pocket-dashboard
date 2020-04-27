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
