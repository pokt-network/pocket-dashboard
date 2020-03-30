import {before, describe, it} from "mocha";
import "chai/register-should";
import ApplicationService from "../../src/services/ApplicationService";
import {
  ApplicationNetworkInfo,
  ApplicationPrivatePocketAccount,
  ApplicationStatuses,
  PocketApplication
} from "../../src/models/Application";

/** @type {ApplicationService} */
let applicationService = null;


before(() => {
  applicationService = new ApplicationService();
});

describe("ApplicationService", () => {

  describe("createApplication", () => {
    it("Expect an application successfully created", async () => {
      const applicationData = {
        name: "Test application",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application"
      };

      /** @type {{privateApplicationData: ApplicationPrivatePocketAccount,networkData:ApplicationNetworkInfo }} */
      const applicationResult = await applicationService.createApplication(applicationData);

      // eslint-disable-next-line no-undef
      should.exist(applicationResult);
      // eslint-disable-next-line no-undef
      should.exist(applicationResult.privateApplicationData.address);
      // eslint-disable-next-line no-undef
      should.exist(applicationResult.privateApplicationData.privateKey);

      applicationResult.privateApplicationData.address.length.should.be.equal(40);
      applicationResult.privateApplicationData.privateKey.length.should.be.equal(128);

      applicationResult.networkData.balance.should.be.equal(0);
      applicationResult.networkData.stakePokt.should.be.equal(0);
      applicationResult.networkData.jailed.should.be.equal(false);
      applicationResult.networkData.status.should.be.equal(ApplicationStatuses.unbounded);
    });
  });

  describe("applicationExists", () => {
    it("Expect a true value", async () => {

      const applicationData = {
        name: "Test application",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application"
      };

      const application = PocketApplication.createPocketApplication(applicationData);
      const exists = await applicationService.applicationExists(application);

      exists.should.be.equal(true);
    });
  });

});
