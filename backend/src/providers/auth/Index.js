import GoogleAuthProvider from "./GoogleAuthProvider";
import GithubAuthProvider from "./GithubAuthProvider";

/** @type Class<BaseAuthProvider>[] */
const AUTH_PROVIDER_CLASSES = [GoogleAuthProvider, GithubAuthProvider];

/**
 *
 * @return {BaseAuthProvider[]}
 */
export function get_auth_providers() {
  return AUTH_PROVIDER_CLASSES.map((provider) => new provider());
}


/**
 *
 * @param {BaseAuthProvider[]} authProviders List of available auth providers.
 * @param {string} name Name of Authentication provider.
 *
 * @return {BaseAuthProvider}
 */
export function getAuthProvider(authProviders, name) {
  return authProviders.filter((provider) => provider.name === name.toLowerCase())[0];
}
