import GoogleAuthProvider from "./GoogleAuthProvider";
import GithubAuthProvider from "./GithubAuthProvider";

/** @type Class<BaseAuthProvider>[] */
const AUTH_PROVIDER_CLASSES = [GoogleAuthProvider, GithubAuthProvider];

/**
 *
 * @return {BaseAuthProvider[]}
 *
 * @private
 */
export function get_auth_providers() {
  return AUTH_PROVIDER_CLASSES.map((provider) => new provider());
}
