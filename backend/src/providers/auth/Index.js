import BaseAuthProvider from "./BaseAuthProvider";
import GoogleAuthProvider from "./GoogleAuthProvider";
import GithubAuthProvider from "./GithubAuthProvider";

/** @type {BaseAuthProvider[]} */
const AUTH_PROVIDER_CLASSES = [GoogleAuthProvider, GithubAuthProvider];

/**
 * @returns {BaseAuthProvider[]} List of instances of auth providers
 */
export function get_auth_providers() {
  return AUTH_PROVIDER_CLASSES.map(provider => new provider());
}

/**
 * @param {BaseAuthProvider[]} authProviders List of available Auth Providers.
 * @param {string} name Name of Authentication provider.
 *
 * @returns {BaseAuthProvider} An auth provider.
 */
export function getAuthProvider(authProviders, name) {
  return authProviders.filter(
    provider => provider.name === name.toLowerCase()
  )[0];
}
