import BaseAuthProvider from "./BaseAuthProvider";
import { Configurations } from "../../_configuration";
import { google } from "googleapis";
import { GoogleUser } from "../../models/User";

export default class GoogleAuthProvider extends BaseAuthProvider {

  constructor() {
    super("google", Configurations.auth.providers.google);
    this.__googleAuth = this.__createGoogleAuth();
  }

  __createGoogleAuth() {
    const { client_id, client_secret, callback_url } = this._authProviderConfiguration;

    return new google.auth.OAuth2(client_id, client_secret, callback_url);
  }

  /**
   * @param {string} token Token to use when authenticate people api.
   * @param {string} tokenType Type of token.
   *
   * @returns {google.people} Google people service.
   * @private
   */
  __getPeopleService(token, tokenType) {
    const auth = this.__createGoogleAuth();
    let credentials = {};

    credentials[tokenType] = token;
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
    const { tokens } = await this.__googleAuth.getToken(code);

    return tokens[tokenType.toLowerCase()];
  }

  async getUserData(token, tokenType) {
    const people = this.__getPeopleService(token, tokenType);

    const { data } = await people.people.get({
      resourceName: "people/me",
      personFields: "emailAddresses,names,photos"
    });

    return new GoogleUser(data.emailAddresses[0].value, data.names[0].displayName);
  }
}
