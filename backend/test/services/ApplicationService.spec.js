import {before, describe, it} from "mocha";
import "chai/register-should";
import ApplicationService from "../../src/services/ApplicationService";
import {configureTestService} from "../setupTests";
import PersistenceProvider from "../../src/providers/data/PersistenceProvider";
import sinon from "sinon";
import {assert, expect} from "chai";
import {PocketApplication} from "../../src/models/Application";

/** @type {string} */
const FREE_TIER_PRIVATE_KEY_WITH_POKT = process.env.POCKET_FREE_TIER_ACCOUNT;

/** @type {string} */
const APPLICATION_ACCOUNT_IN_NETWORK = process.env.TEST_APPLICATION_ACCOUNT_IN_NETWORK;

const applicationService = new ApplicationService();

before(() => {
  configureTestService(applicationService);
});

describe("ApplicationService", () => {

  describe.skip("createApplication", () => {
    it("Expect an application successfully created", async () => {


      const data = {
        name: "Test application",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application"
      };

      const applicationID = await applicationService.createApplication(data);

      // eslint-disable-next-line no-undef
      should.exist(applicationID);

      applicationID.should.be.an("string");

    });
  });

  describe.skip("applicationExists", () => {
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

  describe.skip("updateApplication", () => {
    it("Expect a true value", async () => {
      const applicationData = {
        name: "Test app",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application"
      };

      const applicationResult = await applicationService.createApplication(applicationData);
      const applicationToEdit = {
        ...applicationData,
        name: "To Update",
      };

      const updated = await applicationService.updateApplication(applicationResult.networkData.address, applicationToEdit);

      updated.should.be.true;
    });
  });

  describe("getApplication", () => {
    const address = "bc28256f5c58611e96d13996cf535bdc0204366a";

    const applicationData = {
      name: "Test application 999",
      owner: "Tester",
      url: "http://example.com",
      contactEmail: "tester@app.com",
      user: "tester@app.com",
      description: "A test application",
      publicPocketAccount: {
        address: address,
        publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
      }
    };

    it("Expect an application", async () => {

      const persistenceService = sinon.createStubInstance(PersistenceProvider);
      const stubFilter = {
        "publicPocketAccount.address": address
      };

      persistenceService.getEntityByFilter
        .withArgs("Applications", stubFilter)
        .returns(Promise.resolve(applicationData));

      sinon.stub(applicationService, "persistenceService").value(persistenceService);

      const application = await applicationService.getApplication(address);

      // eslint-disable-next-line no-undef
      should.exist(application);

      application.should.be.an("object");
    });
  });

  if (APPLICATION_ACCOUNT_IN_NETWORK) {
    describe("importApplication", () => {
      it("Expect an application network data", async () => {

        const applicationNetworkData = await applicationService.importApplication(APPLICATION_ACCOUNT_IN_NETWORK);

        // eslint-disable-next-line no-undef
        should.exist(applicationNetworkData);

        applicationNetworkData.should.be.an("object");
      });
    });
  }

  describe("importApplication with invalid address", () => {
    it("Expect an error", async () => {

      try {
        await applicationService.importApplication("NOT_VALID_ADDRESS");
        assert.fail();
      } catch (e) {
        expect(e.message).to.be.equal("Invalid Address Hex");
      }
    });
  });

  describe.skip("deleteApplication", () => {
    const address = "bc28256f5c58611e96d13996cf535bdc0204366a";
    const user = "tester@app.com";

    const resultData = {
      result: {
        ok: 1
      }
    };

    it("Expect success", async () => {

      const persistenceService = sinon.createStubInstance(PersistenceProvider);
      const stubFilter = {
        "publicPocketAccount.address": address,
        user
      };

      persistenceService.deleteEntities
        .withArgs("Applications", stubFilter)
        .returns(Promise.resolve(resultData));

      sinon.stub(applicationService, "persistenceService").value(persistenceService);

      const application = await applicationService.deleteApplication(address, user);

      // eslint-disable-next-line no-undef
      should.exist(application);

      application.should.be.an("object");
    });
  });

  describe("getStakedApplicationSummary", () => {
    it("Expect staked summary data from network", async () => {

      const summaryData = await applicationService.getStakedApplicationSummary();

      // eslint-disable-next-line no-undef
      should.exist(summaryData);

      summaryData.should.be.an("object");
      summaryData.totalApplications.should.not.be.equal("0");
      summaryData.averageStaked.should.not.be.equal("0");
      summaryData.averageRelays.should.not.be.equal("0");
    });
  }).timeout(5000);

  describe.skip("listApplications", () => {
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
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
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
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
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
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
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
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
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
          address: "bc28256f5c58611e96d13996cf535bdc0204366a",
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
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
