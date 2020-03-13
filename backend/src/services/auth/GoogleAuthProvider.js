import BaseAuthProvider from "./BaseAuthProvider";
import {Configurations} from "../../_configuration";
import {google} from "googleapis";
import {GoogleUser} from "../../models/User";

class GoogleAuthProvider extends BaseAuthProvider {

  constructor() {
    super("google", Configurations.auth.providers.google);
    this.__googleAuth = this.__createGoogleAuth();
  }

  __createGoogleAuth() {
    return new google.auth.OAuth2(
      this._authProviderConfiguration.client_id,
      this._authProviderConfiguration.client_secret,
      this._authProviderConfiguration.callback_url
    );
  }

  /**
   * @param {string} token Token to use when authenticate people api.
   * @param {string} tokenType Type of token.
   *
   * @private
   */
  __getPeopleService(token, tokenType) {
    let credentials = {};
    credentials[tokenType] = token;

    const auth = this.__createGoogleAuth();
    auth.setCredentials(credentials);

    return google.people({
      version: "v1",
      auth
    });
  }

  getConsentURL() {
    return this.__googleAuth.generateAuthUrl({
      access_type: "offline",
      prompt: "consent",
      scope: this._authProviderConfiguration.scopes
    });
  }

  async getToken(code, tokenType) {
    const {tokens} = await this.__googleAuth.getToken(code);

    return tokens[tokenType.toLowerCase()];
  }

  async getUserData(token, tokenType) {
    const people = this.__getPeopleService(token, tokenType);

    const {data} = await people.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos"
    });

    return new GoogleUser(data.resourceName, data.names[0].displayName, data.emailAddresses[0].value, data.photos[0].url);
  }
}

export default GoogleAuthProvider;
