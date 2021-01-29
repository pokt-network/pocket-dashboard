import BaseAuthProvider from "./BaseAuthProvider";
import { Configurations } from "../../_configuration";
import * as queryString from "query-string";
import axios from "axios";
import { GithubUser } from "../../models/User";

export default class GithubAuthProvider extends BaseAuthProvider {

  constructor() {
    super("github", Configurations.auth.providers.github);
  }

  getConsentURL() {
    const params = queryString.stringify({
      client_id: this._authProviderConfiguration.client_id,
      redirect_uri: this._authProviderConfiguration.callback_url,
      scope: this._authProviderConfiguration.scopes.join(" "),
      allow_signup: true,
    });

    return `${this._authProviderConfiguration.urls.consent_url}?${params}`;
  }

  async getToken(code, tokenType) {
    const requestParams = {
      client_id: this._authProviderConfiguration.client_id,
      client_secret: this._authProviderConfiguration.client_secret,
      code,
    };

    const response = await axios({
      url: this._authProviderConfiguration.urls.access_token,
      method: "POST",
      params: requestParams,
    });

    const parsedData = queryString.parse(response.data);

    if (parsedData.error) {
      /** @type {string} */
      const error = parsedData.error_description;

      throw new Error(error);
    }

    return parsedData.access_token;
  }

  async getUserData(token, tokenType) {
    const response = await axios({
      url: this._authProviderConfiguration.urls.user_info_url,
      method: "get",
      headers: {
        Authorization: `token ${token}`,
      },
    });

    /** @type {{name: string, email: string}} */
    const { data } = response;

    return new GithubUser(data.email, data.name);
  }
}
