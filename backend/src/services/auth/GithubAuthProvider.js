import BaseAuthProvider from "./BaseAuthProvider";
import {Configurations} from "../../_configuration";
import * as queryString from "query-string";
import axios from "axios";
import {GithubAuthProviderUser} from "../../models/User";

class GithubAuthProvider extends BaseAuthProvider {

  constructor() {
    super("github", Configurations.auth.providers.github);
  }

  get_consent_url() {
    const params = queryString.stringify({
      client_id: this._authProviderConfiguration.client_id,
      redirect_uri: this._authProviderConfiguration.callback_url,
      scope: this._authProviderConfiguration.scopes.join(" "),
      allow_signup: true,
    });

    return `${this._authProviderConfiguration.urls.consent_url}?${params}`;
  }


  extract_code_from_url(url) {
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

  async get_access_token(code) {
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
      /** @type string */
      const error = parsedData.error_description;

      throw new Error(error);
    }

    /** @type {string} */
    return parsedData.access_token;
  }

  async get_user_data(accessToken) {
    const response = await axios({
      url: this._authProviderConfiguration.urls.user_info_url,
      method: "get",
      headers: {
        Authorization: `token ${accessToken}`,
      },
    });

    /** @type {{id:string, name: string, email: string, avatar_url: string}} */
    const {data} = response;

    return new GithubAuthProviderUser(data.id, data.name, data.email, data.avatar_url);
  }
}

export default GithubAuthProvider;
