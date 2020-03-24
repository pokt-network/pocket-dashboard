import {after, before, describe, it} from "mocha";
import "chai/register-should";
import {expect} from "chai";
import GithubAuthProvider from "../../../src/providers/auth/GithubAuthProvider";


/** @type BaseAuthProvider */
let githubProvider = null;

/** @type string */
const GITHUB_AUTH_URL_WITH_CODE = process.env.TEST_GITHUB_AUTH_URL_WITH_CODE; // You can get yours using the getConsentURL of GithubAuthProvider

/** @type string */
const GITHUB_ACCESS_TOKEN = process.env.TEST_GITHUB_ACCESS_TOKEN; // You can get yours using the getConsentURL of GithubAuthProvider

before(() => {
  githubProvider = new GithubAuthProvider();
});


after(() => {
  githubProvider = null;
});

describe("GithubAuthProvider", () => {

  describe("getConsentURL", () => {
    it("Expect a valid url", () => {

      const consent_url = githubProvider.getConsentURL();

      consent_url.should.to.be.a("string");
    });
  });

  if (GITHUB_AUTH_URL_WITH_CODE !== undefined) {
    describe("extractCodeFromURL", () => {
      it("Expect a string code", () => {

        const code = githubProvider.extractCodeFromURL(GITHUB_AUTH_URL_WITH_CODE);

        code.should.to.be.a("string");
      });
    });
  }

  describe("extractCodeFromURL with error", () => {
    it("Expect an error", () => {
      const badURL = "http://example.com/foo/bar";

      const errorFn = () => githubProvider.extractCodeFromURL(badURL);

      expect(errorFn).to.throw();
    });
  });

  if (GITHUB_ACCESS_TOKEN !== undefined) {
    describe("getUserData", () => {
      it("Expect user data from github", async () => {

        const userData = await githubProvider.getUserData(GITHUB_ACCESS_TOKEN);

        userData.should.to.be.an("object");
      });
    });
  }

});
