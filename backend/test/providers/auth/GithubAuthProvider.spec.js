import {before, describe, it} from "mocha";
import "chai/register-should";
import {expect} from "chai";
import GithubAuthProvider from "../../../src/providers/auth/GithubAuthProvider";
import BaseAuthProvider from "../../../src/providers/auth/BaseAuthProvider";

/** @type {BaseAuthProvider} */
let githubProvider = null;


/** @type {string} */
const GITHUB_ACCESS_TOKEN = process.env.TEST_GITHUB_ACCESS_TOKEN; // You can get yours using the getConsentURL of GithubAuthProvider

before(() => {
  githubProvider = new GithubAuthProvider();
});


describe("GithubAuthProvider", () => {

  describe("getConsentURL", () => {
    it("Expect a valid url", () => {

      const consent_url = githubProvider.getConsentURL();

      consent_url.should.to.be.a("string");
    });
  });

  describe("extractCodeFromURL", () => {
    it("Expect a string code", () => {
      const urlWithCode = "http://example.com/foo/bar?code=code_data";
      const code = githubProvider.extractCodeFromURL(urlWithCode);

      code.should.to.be.a("string");
    });
  });

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
