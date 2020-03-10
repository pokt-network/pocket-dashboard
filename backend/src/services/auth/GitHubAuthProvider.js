import BaseAuthProvider from "./BaseAuthProvider";
import {configurations} from "../../_configuration";

class GitHubAuthProvider extends BaseAuthProvider {

  constructor() {
    super(configurations.auth.providers.github);
  }

  get_consent_url() {
    return super.get_consent_url();
  }

  get_token_code(url) {
    return super.get_token_code(url);
  }
}

export default GitHubAuthProvider;
