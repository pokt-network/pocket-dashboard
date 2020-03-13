import {after, before, describe, it} from "mocha";
import "chai/register-should";
import {expect} from "chai";
import GithubAuthProvider from "../../../src/services/auth/GithubAuthProvider";


/** @type GithubAuthProvider */
let githubProvider = null;

/** @type string */
const GITHUB_AUTH_URL_WITH_CODE = process.env.TEST_GITHUB_AUTH_URL_WITH_CODE; // You can get yours using the get_consent_url of GithubAuthProvider

/** @type string */
const GITHUB_ACCESS_TOKEN = process.env.TEST_GITHUB_ACCESS_TOKEN; // You can get yours using the get_consent_url of GithubAuthProvider

before(() => {
  githubProvider = new GithubAuthProvider();
});


after(() => {
  githubProvider = null;
});

describe("GithubAuthProvider", () => {

  describe("get_consent_url", () => {
    it("Expect a valid url", () => {

      const consent_url = githubProvider.get_consent_url();

      consent_url.should.to.be.a("string");
    });
  });

  if (GITHUB_AUTH_URL_WITH_CODE !== undefined) {
    describe("extract_code_from_url", () => {
      it("Expect a string code", () => {

        const code = githubProvider.extract_code_from_url(GITHUB_AUTH_URL_WITH_CODE);

        code.should.to.be.a("string");
      });
    });
  }

  describe("extract_code_from_url with error", () => {
    it("Expect an error", () => {
      const badURL = "http://example.com/foo/bar";

      const errorFn = () => githubProvider.extract_code_from_url(badURL);

      expect(errorFn).to.throw();
    });
  });

  if (GITHUB_ACCESS_TOKEN !== undefined) {
    describe("get_user_data", () => {
      it("Expect user data from github", async () => {

        const userData = await githubProvider.get_user_data(GITHUB_ACCESS_TOKEN);

        userData.should.to.be.an("object");
      });
    });
  }

});
