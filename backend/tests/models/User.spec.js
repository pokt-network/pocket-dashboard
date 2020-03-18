import {describe, it} from "mocha";
import "chai/register-should";
import {expect} from "chai";
import {PocketUser} from "../../src/models/User";

describe("User model", () => {

  describe("validate user data fail scenarios", () => {
    it("Expect an error when email address is invalid", () => {

      const testData = {
        email: "bad email",
        username: "username",
        password1: "secret12",
        password2: "secret12"
      };

      const errorFn = () => PocketUser.validate(testData);

      expect(errorFn).to.throw();
    });

    it("Expect an error when username is invalid", () => {

      const testData = {
        email: "example@poktnetwork.com",
        username: "user name",
        password1: "secret12",
        password2: "secret12"
      };

      const errorFn = () => PocketUser.validate(testData);

      expect(errorFn).to.throw();
    });

    it("Expect an error when passwords do not match", () => {

      const testData = {
        email: "example@poktnetwork.com",
        username: "username",
        password1: "secret123",
        password2: "secret12"
      };

      const errorFn = () => PocketUser.validate(testData);

      expect(errorFn).to.throw();
    });

    it("Expect an error when passwords do not have the minimum characters required", () => {

      const testData = {
        email: "example@poktnetwork.com",
        username: "username",
        password1: "secret1",
        password2: "secret1"
      };

      const errorFn = () => PocketUser.validate(testData);

      expect(errorFn).to.throw();
    });
  });

  describe("validate user data success scenarios", () => {
    it("Expect a success validation", () => {

      const testData = {
        email: "example@poktnetwork.com",
        username: "username",
        password1: "secret12",
        password2: "secret12"
      };

      const result = PocketUser.validate(testData);

      // noinspection BadExpressionStatementJS
      result.should.to.be.true;
    });
  });

});
