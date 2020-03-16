import {Configurations} from "../../_configuration";

class PocketBaseService {

  /**
   * @param {string} baseServiceURL Base service URL (ex. "api/user")
   */
  constructor(baseServiceURL) {
    this._serviceURL = `${Configurations.backendUrl}/${baseServiceURL}`;
  }

  /**
   * @param {string} apiPath Relative path to the specific api method.
   *
   * @return {string}
   * @protected
   */
  _getURL(apiPath) {
    return `${this._serviceURL}/${apiPath}`;
  }
}

export default PocketBaseService;
