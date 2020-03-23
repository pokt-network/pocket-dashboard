import * as queryString from "query-string";

export default class BaseAuthProvider {

  /**
   * @param {string} name Name of auth backend provider.
   * @param {object} authProviderConfiguration Authentication provider basic configuration.
   *
   * @param {string} authProviderConfiguration.client_id
   * @param {string} authProviderConfiguration.client_secret
   * @param {string} authProviderConfiguration.callback_url
   * @param {string[]} authProviderConfiguration.scopes
   * @param {object} [authProviderConfiguration.urls]
   * @param {string} authProviderConfiguration.urls.consent_url
   * @param {string} authProviderConfiguration.urls.access_token
   * @param {string} authProviderConfiguration.urls.user_info_url
   *
   */
  constructor(name, authProviderConfiguration) {
    this.name = name.toLowerCase();
    this._authProviderConfiguration = authProviderConfiguration;
  }

  /**
   * Get the consent url to render on frontend.
   *
   * @returns {string}
   */
  getConsentURL() {
  }

  /**
   * Get code from consent redirect url.
   *
   * @param {string} url URL returned from backend auth provider(from outside).
   *
   * @return {string}
   */
  extractCodeFromURL(url) {
    const responseURL = new URL(url);
    const parsedData = queryString.parse(responseURL.search);

    if (parsedData.error) {
      /** @type string */
      const error = parsedData.error_description;

      throw new Error(error);
    }

    if (parsedData.code === undefined) {
      throw new Error("URL does not contain code on query string");
    }

    return parsedData.code;
  }

  /**
   * Get access token using the code returned from consent url.
   *
   * @param {string} code Code to retrieve token from auth provider.
   * @param {string} [tokenType] Type of token to retrieve from auth provider.
   *
   * @returns {Promise<string>}
   */
  async getToken(code, tokenType) {
  }

  /**
   * Get User data from auth provider.
   *
   * @param {string} token Token used to retrieve information from auth provider.
   * @param {string} [tokenType] Type of token [access|refresh].
   *
   * @returns {Promise<AuthProviderUser>}
   */
  async getUserData(token, tokenType) {
  }
}
