import {before, describe, it} from "mocha";
import "chai/register-should";
import ApplicationService from "../../src/services/ApplicationService";
import {ApplicationPrivatePocketAccount, PocketApplication} from "../../src/models/Application";
import {Application, StakingStatus} from "@pokt-network/pocket-js";
import {configureTestService} from "../setupTests";
import PersistenceProvider from "../../src/providers/data/PersistenceProvider";
import sinon from "sinon";

/** @type {string} */
const FREE_TIER_APPLICATION_PRIVATE_KEY = process.env.TEST_FREE_TIER_APPLICATION_PRIVATE_KEY;

/** @type {string} */
const FREE_TIER_ADDRESS = process.env.TEST_FREE_TIER_ADDRESS;

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

      /** @type {{privateApplicationData: ApplicationPrivatePocketAccount, networkData:Application}} */
      const applicationResult = await applicationService.createApplication(applicationData) || false;

      // eslint-disable-next-line no-undef
      should.exist(applicationResult);
      // eslint-disable-next-line no-undef
      should.exist(applicationResult.privateApplicationData.address);
      // eslint-disable-next-line no-undef
      should.exist(applicationResult.privateApplicationData.privateKey);

      applicationResult.privateApplicationData.address.length.should.be.equal(40);
      applicationResult.privateApplicationData.privateKey.length.should.be.equal(128);

      applicationResult.networkData.stakedTokens.toString().should.be.equal("0");
      applicationResult.networkData.jailed.should.be.equal(false);
      applicationResult.networkData.status.should.be.equal(StakingStatus.Unstaked);
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

  if (FREE_TIER_APPLICATION_PRIVATE_KEY && FREE_TIER_ADDRESS) {
    describe("createFreeTierApplication", () => {

      const applicationData = {
        name: "Test application 999",
        owner: "Tester",
        url: "http://example.com",
        contactEmail: "tester@app.com",
        user: "tester@app.com",
        description: "A test application",
        publicPocketAccount: {
          address: FREE_TIER_ADDRESS,
          publicKey: "642f58349a768375d39747d96ea174256c5e1684bf4a8ae92c5ae0d14a9ed291"
        }
      };

      it("Expect an aat", async () => {

        const persistenceService = sinon.createStubInstance(PersistenceProvider);
        const stubFilter = {
          "publicPocketAccount.address": FREE_TIER_ADDRESS
        };

        persistenceService.getEntityByFilter
          .withArgs("Applications", stubFilter)
          .returns(Promise.resolve(applicationData));

        sinon.stub(applicationService, "persistenceService").value(persistenceService);

        const networkChains = [
          "a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309"
        ];

        const aat = await applicationService.createFreeTierApplication(FREE_TIER_APPLICATION_PRIVATE_KEY, networkChains);

        // eslint-disable-next-line no-undef
        should.exist(aat);

        aat.should.be.an("object");
      });
    });
  }

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

    it("Expect a application", async () => {

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
