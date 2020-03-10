import BaseAuthProvider from "./BaseAuthProvider";
import {configurations} from "../../_configuration";

class GoogleAuthProvider extends BaseAuthProvider {

  constructor() {
    super(configurations.auth.providers.google);
  }

  get_consent_url() {
    return super.get_consent_url();
  }

  get_token_code(url) {
    return super.get_token_code(url);
  }
}

export default GoogleAuthProvider;
