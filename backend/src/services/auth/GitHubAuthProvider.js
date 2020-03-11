import BaseAuthProvider from "./BaseAuthProvider";
import {Configurations} from "../../_configuration";

class GitHubAuthProvider extends BaseAuthProvider {

  constructor() {
    super('github', Configurations.auth.providers.github);
  }

  get_consent_url() {
    return super.get_consent_url();
  }

  get_user_data(url) {
    return super.get_user_data(url);
  }
}

export default GitHubAuthProvider;
