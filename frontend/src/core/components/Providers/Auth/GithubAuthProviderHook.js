import { BaseAuthProviderHook } from "./BaseAuthProviderHook";

class GithubAuthProviderHook extends BaseAuthProviderHook {

  constructor(props, context) {
    super("github", props, context);
  }
}

export default GithubAuthProviderHook;
