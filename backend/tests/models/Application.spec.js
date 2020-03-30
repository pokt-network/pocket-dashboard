import {describe, it} from "mocha";
import "chai/register-should";
import {expect} from "chai";
import {PocketApplication} from "../../src/models/Application";

describe("Application model", () => {

  describe("validate application data fail scenarios", () => {
    it("Expect an error when contact email address is invalid", () => {

      const applicationData = {
        name: "Test application",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@ap",
        user: "tester@ap"
      };

      const errorFn = () => PocketApplication.validate(applicationData);

      expect(errorFn).to.throw();
    });

    it("Expect an error when url is invalid", () => {

      const applicationData = {
        name: "Test App",
        owner: "Tester",
        url: "fgdfgd.com/dfgdfg",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application"
      };

      const errorFn = () => PocketApplication.validate(applicationData);

      expect(errorFn).to.throw();
    });

    it("Expect an error when name is invalid", () => {

      const applicationData = {
        name: "",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application"
      };

      const errorFn = () => PocketApplication.validate(applicationData);

      expect(errorFn).to.throw();
    });

    it("Expect an error when owner is invalid", () => {

      const applicationData = {
        name: "Test app",
        owner: "",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application"
      };

      const errorFn = () => PocketApplication.validate(applicationData);

      expect(errorFn).to.throw();
    });

    it("Expect an error when user is invalid", () => {

      const applicationData = {
        name: "Test app",
        owner: "",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@",
        description: "A test application"
      };

      const errorFn = () => PocketApplication.validate(applicationData);

      expect(errorFn).to.throw();
    });
  });

  describe("validate application data success scenarios", () => {
    it("Expect a success validation", () => {

      const applicationData = {
        name: "Test application",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application"
      };

      const result = PocketApplication.validate(applicationData);

      // noinspection BadExpressionStatementJS
      result.should.to.be.true;
    });
  });

});
