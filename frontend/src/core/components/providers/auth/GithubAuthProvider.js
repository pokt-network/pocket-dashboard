import BaseAuthProviderComponent from "./BaseAuthProviderComponent";

class GithubAuthProvider extends BaseAuthProviderComponent {

  constructor(props, context) {
    super("github", props, context);
  }
}

export default GithubAuthProvider;
