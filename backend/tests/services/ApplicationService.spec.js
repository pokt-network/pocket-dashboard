import {after, before, describe, it} from "mocha";
import "chai/register-should";
import ApplicationService from "../../src/services/ApplicationService";
import MongoDBAdapter from "../../src/providers/data/db/MongoDBAdapter";
import {Configurations} from "../../src/_configuration";
import sinon from "sinon";
import * as dbProvider from "../../src/providers/data/db";
import {
  ApplicationNetworkInfo,
  ApplicationPrivatePocketAccount,
  ApplicationStatuses,
  PocketApplication
} from "../../src/models/Application";
import * as pocket from "../../src/services/PocketService";
import PersistenceProvider from "../../src/providers/data/PersistenceProvider";

/** @type {MongoDBAdapter} */
let mongoDBProvider = null;

/** @type {ApplicationService} */
let applicationService = null;

/** @type {PersistenceProvider} */
let persistenceService = null;

const APPLICATION_COLLECTION_NAME = "Applications";

before(() => {
  mongoDBProvider = new MongoDBAdapter(Configurations.persistence.test);
  sinon.stub(dbProvider, "get_default_db_provider").returns(mongoDBProvider);

  sinon.stub(pocket, "get_default_pocket_network").returns(Configurations.pocketNetwork.nodes.test);

  persistenceService = new PersistenceProvider();
  applicationService = new ApplicationService();
});


after(async () => {
  await persistenceService.deleteEntities(APPLICATION_COLLECTION_NAME, {});
  const collection = await persistenceService.getCollection(APPLICATION_COLLECTION_NAME);

  await collection.drop();

  mongoDBProvider = null;
  persistenceService = null;
  applicationService = null;
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
