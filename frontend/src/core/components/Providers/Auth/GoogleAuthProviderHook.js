import { BaseAuthProviderHook } from "./BaseAuthProviderHook";

class GoogleAuthProviderHook extends BaseAuthProviderHook {

  constructor(props, context) {
    super("google", props, context);
  }
}

export default GoogleAuthProviderHook;
