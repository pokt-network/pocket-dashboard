import {after, before, describe, it} from "mocha";
import "chai/register-should";
import {expect} from "chai";
import GoogleAuthProvider from "../../../src/providers/auth/GoogleAuthProvider";


/** @type BaseAuthProvider */
let googleAuthProvider = null;

/** @type string */
const GOOGLE_AUTH_URL_WITH_CODE = process.env.TEST_GOOGLE_AUTH_URL_WITH_CODE; // You can get yours using the getConsentURL of GoogleAuthProvider

/** @type string */
const GOOGLE_REFRESH_TOKEN = process.env.TEST_GOOGLE_REFRESH_TOKEN; // You can get yours using the getConsentURL of GoogleAuthProvider

before(() => {
  googleAuthProvider = new GoogleAuthProvider();
});


after(() => {
  googleAuthProvider = null;
});

describe("GoogleAuthProvider", () => {

  describe("getConsentURL", () => {
    it("Expect a valid url", () => {

      const consent_url = googleAuthProvider.getConsentURL();

      consent_url.should.to.be.a("string");
    });
  });

  if (GOOGLE_AUTH_URL_WITH_CODE !== undefined) {
    describe("extractCodeFromURL", () => {
      it("Expect a string code", () => {

        const code = googleAuthProvider.extractCodeFromURL(GOOGLE_AUTH_URL_WITH_CODE);

        code.should.to.be.a("string");
      });
    });
  }

  describe("extractCodeFromURL with error", () => {
    it("Expect an error", () => {
      const badURL = "http://example.com/foo/bar";

      const errorFn = () => googleAuthProvider.extractCodeFromURL(badURL);

      expect(errorFn).to.throw();
    });
  });

  if (GOOGLE_REFRESH_TOKEN !== undefined) {
    describe("getUserData", () => {
      it("Expect user data from google", async () => {

        const userData = await googleAuthProvider.getUserData(GOOGLE_REFRESH_TOKEN, "refresh_token");

        userData.should.to.be.an("object");
      });
    });
  }

});
