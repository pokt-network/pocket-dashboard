import BaseAuthProvider from "./BaseAuthProvider";
import {Configurations} from "../../_configuration";

class GoogleAuthProvider extends BaseAuthProvider {

  constructor() {
    super("google", Configurations.auth.providers.google);
  }

  get_consent_url() {
    return super.get_consent_url();
  }


  extract_code_from_url(url) {
    super.extract_code_from_url(url);
  }

  async get_access_token(code) {
    super.get_access_token(code);
  }

  async get_user_data(accessToken) {
    super.get_user_data(accessToken);
  }
}

export default GoogleAuthProvider;
