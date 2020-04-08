import * as queryString from "query-string";
import {AuthProviderUser} from "../../models/User";

export default class BaseAuthProvider {

  /**
   * @param {string} name Name of Auth backend provider.
   * @param {object} authProviderConfiguration Authentication provider basic configuration.
   *
   * @param {string} authProviderConfiguration.client_id Client ID of OAuth protocol.
   * @param {string} authProviderConfiguration.client_secret Client Secret of OAuth protocol.
   * @param {string} authProviderConfiguration.callback_url Callback URL of OAuth protocol.
   * @param {string[]} authProviderConfiguration.scopes Scopes allowed.
   * @param {object} [authProviderConfiguration.urls] URL's used for calls to API.
   * @param {string} authProviderConfiguration.urls.consent_url Base consent URL.
   * @param {string} authProviderConfiguration.urls.access_token Base access token URL.
   * @param {string} authProviderConfiguration.urls.user_info_url Base user info URL.
   */
  constructor(name, authProviderConfiguration) {
    this.name = name.toLowerCase();
    this._authProviderConfiguration = authProviderConfiguration;
  }

  /**
   * Get the consent url to render on frontend.
   *
   * @returns {string} the consent URL.
   * @abstract
   */
  getConsentURL() {
  }

  /**
   * Get code from consent redirect url.
   *
   * @param {string} url URL returned from backend Auth provider(from outside).
   *
   * @returns {string} Code retrieved from callback URL.
   */
  extractCodeFromURL(url) {
    const responseURL = new URL(url);
    const parsedData = queryString.parse(responseURL.search);

    if (parsedData.error) {
      /** @type {string} */
      const error = parsedData.error_description;

      throw new Error(error);
    }

    if (parsedData.code === undefined) {
      throw new Error("URL does not contain code on query string");
    }

    return parsedData.code;
  }

  /**
   * Get token using the code returned from consent url.
   *
   * @param {string} code Code to retrieve token from Auth provider.
   * @param {string} [tokenType] Type of token to retrieve from Auth provider.
   *
   * @returns {Promise<string>} Access token.
   * @abstract
   */
  async getToken(code, tokenType) {
  }

  /**
   * Get User data from Auth provider.
   *
   * @param {string} token Token used to retrieve information from Auth provider.
   * @param {string} [tokenType] Type of token [access|refresh].
   *
   * @returns {Promise<AuthProviderUser>} Auth provider user.
   * @abstract
   */
  async getUserData(token, tokenType) {
  }
}
