import {before, describe, it} from "mocha";
import "chai/register-should";
import ApplicationService from "../../src/services/ApplicationService";
import {
  ApplicationNetworkInfo,
  ApplicationPrivatePocketAccount,
  ApplicationStatuses,
  PocketApplication
} from "../../src/models/Application";
import {configureTestService} from "../setupTests";
import PersistenceProvider from "../../src/providers/data/PersistenceProvider";
import sinon from "sinon";

const applicationService = new ApplicationService();

before(() => {
  configureTestService(applicationService);
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

  describe("listApplications", () => {
    const user = "tester@app.com";
    const limit = 10;
    const offset = 0;

    const applicationData = [
      {
        name: "Test application 1",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application",
        publicPocketAccount: {
          address: "7ee87e5738ffa409dd4cdec3a2703c90bbb34811"
        }
      },
      {
        name: "Test application 2",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application",
        publicPocketAccount: {
          address: "7ee87e5738ffa409dd4cdec3a2703c90bbb34811"
        }
      },
      {
        name: "Test application 3",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application",
        publicPocketAccount: {
          address: "7ee87e5738ffa409dd4cdec3a2703c90bbb34811"
        }
      },
      {
        name: "Test application 4",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application",
        publicPocketAccount: {
          address: "7ee87e5738ffa409dd4cdec3a2703c90bbb34811"
        }
      },
      {
        name: "Test application 5",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application",
        publicPocketAccount: {
          address: "7ee87e5738ffa409dd4cdec3a2703c90bbb34811"
        }
      }
    ];

    it("Expect a list of applications", async () => {

      const persistenceService = sinon.createStubInstance(PersistenceProvider);

      persistenceService.getEntities
        .withArgs("Applications", {}, limit, offset)
        .returns(Promise.resolve(applicationData));

      sinon.stub(applicationService, "persistenceService").value(persistenceService);

      const applications = await applicationService.getAllApplications(limit, offset);

      // eslint-disable-next-line no-undef
      should.exist(applications);

      applications.should.be.an("array");
      applications.length.should.be.greaterThan(0);
    });

    it("Expect a list of user applications", async () => {

      const persistenceService = sinon.createStubInstance(PersistenceProvider);

      persistenceService.getEntities
        .withArgs("Applications", {user: user}, limit, offset)
        .returns(Promise.resolve(applicationData));

      sinon.stub(applicationService, "persistenceService").value(persistenceService);

      const applications = await applicationService.getUserApplications(user, limit, offset);

      // eslint-disable-next-line no-undef
      should.exist(applications);

      applications.should.be.an("array");
      applications.length.should.be.greaterThan(0);
    });
  });
});
