import BaseAuthProviderComponent from "./BaseAuthProviderComponent";

class GoogleAuthProvider extends BaseAuthProviderComponent {

  constructor(props, context) {
    super("google", props, context);
  }
}

export default GoogleAuthProvider;
