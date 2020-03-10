class BaseAuthProvider {

  /**
   *
   * @param {object} authProviderConfiguration Authentication provider basic configuration.
   *
   * @param {string} authProviderConfiguration.client_id
   * @param {string} authProviderConfiguration.client_secret
   * @param {string} authProviderConfiguration.callback_url
   *
   */
  constructor(authProviderConfiguration) {
    this.authProviderConfiguration = authProviderConfiguration;
  }

  /**
   * Get the consent url to render on frontend.
   *
   * @returns {string}
   */
  get_consent_url() {
    return "";
  }

  /**
   *
   * @param {string| URL} url URL returned from backend auth provider(from outside).
   *
   * @returns {string}
   */
  get_token_code(url) {
    return "";
  }
}

export default BaseAuthProvider;
