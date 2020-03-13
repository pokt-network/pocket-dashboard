class BaseAuthProvider {

  /**
   *
   * @param {string} name Name of auth backend provider.
   * @param {object} authProviderConfiguration Authentication provider basic configuration.
   *
   * @param {string} authProviderConfiguration.client_id
   * @param {string} authProviderConfiguration.client_secret
   * @param {string} authProviderConfiguration.callback_url
   * @param {string[]} authProviderConfiguration.scopes
   * @param {object} authProviderConfiguration.urls
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
  get_consent_url() {
  }

  /**
   * Get code from consent redirect url.
   *
   * @param {string} url URL returned from backend auth provider(from outside).
   *
   * @return {string}
   */
  // eslint-disable-next-line no-unused-vars
  extract_code_from_url(url) {
  }

  /**
   * Get access token using the code returned from consent url.
   *
   * @param {string} code Code to retrieve access token from auth provider.
   *
   * @returns {Promise<string>}
   */
  // eslint-disable-next-line no-unused-vars
  async get_access_token(code) {
  }

  /**
   * Get User data from auth provider.
   *
   * @param {string} accessToken Access Token used to retrieve information from auth provider.
   *
   * @returns {Promise<AuthProviderUser>}
   */
  // eslint-disable-next-line no-unused-vars
  async get_user_data(accessToken) {
  }
}

export default BaseAuthProvider;
