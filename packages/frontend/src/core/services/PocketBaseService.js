import { Configurations } from "../../environment";

class PocketBaseService {
  /**
   * @param {string} baseServiceURL Base service URL (ex. "api/user")
   */
  constructor(baseServiceURL) {
    this._serviceURL = `${Configurations.backendUrl}/${baseServiceURL}`;
  }

  /**
   * @param {string} [apiPath] Relative path to the specific api type.
   *
   * @return {string}
   * @protected
   */
  _getURL(apiPath = "") {
    return `${this._serviceURL}/${apiPath}`;
  }
}

export default PocketBaseService;
