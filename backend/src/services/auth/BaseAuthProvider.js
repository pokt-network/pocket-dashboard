class BaseAuthProvider {

  /**
   *
   * @param {string} name Name of auth backend provider.
   * @param {object} authProviderConfiguration Authentication provider basic configuration.
   *
   * @param {string} authProviderConfiguration.client_id
   * @param {string} authProviderConfiguration.client_secret
   * @param {string} authProviderConfiguration.callback_url
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
   *
   * @param {string| URL} url URL returned from backend auth provider(from outside).
   *
   * @returns {string}
   */
  // eslint-disable-next-line no-unused-vars
  get_user_data(url) {
  }
}

export default BaseAuthProvider;
