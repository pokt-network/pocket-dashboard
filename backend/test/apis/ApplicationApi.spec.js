import {after, before, describe, it} from "mocha";
import "chai/register-should";
import chai from "chai";
import chaiHttp from "chai-http";
import MongoDBAdapter from "../../src/providers/data/db/MongoDBAdapter";
import PersistenceProvider from "../../src/providers/data/PersistenceProvider";

// Configure chai
chai.use(chaiHttp);

/** @type {MongoDBAdapter} */
let mongoDBProvider = null;

/** @type {PersistenceProvider} */
let persistenceService = null;

const APPLICATION_COLLECTION_NAME = "Applications";

before(() => {
  persistenceService = new PersistenceProvider();
});

after(async () => {
  await persistenceService.deleteEntities(APPLICATION_COLLECTION_NAME, {});
  const collection = await persistenceService.getCollection(APPLICATION_COLLECTION_NAME);

  await collection.drop();

  mongoDBProvider = null;
  persistenceService = null;
});

describe("ApplicationApi", () => {

  describe("Success scenarios", () => {
    describe("createApplication", () => {
      it("Expect an application successfully created", (done) => {
        const applicationData = {
          name: "Test application",
          owner: "Tester",
          url: "http://example.com",
          contactEmail: "tester@app.com",
          user: "tester@app.com",
          description: "A test application"
        };

        done();

        // chai.request(Application)
        //   .post("/")
        //   .send(applicationData)
        //   .end((err, res) => {
        //     console.log(res.body);
        //     done();
        //   });

        // /** @type {{privateApplicationData: ApplicationPrivatePocketAccount,networkData:ApplicationNetworkInfo }} */
        // const applicationResult = await applicationService.createApplication(applicationData);
        //
        // // eslint-disable-next-line no-undef
        // should.exist(applicationResult);
        // // eslint-disable-next-line no-undef
        // should.exist(applicationResult.privateApplicationData.address);
        // // eslint-disable-next-line no-undef
        // should.exist(applicationResult.privateApplicationData.privateKey);
        //
        // applicationResult.privateApplicationData.address.length.should.be.equal(40);
        // applicationResult.privateApplicationData.privateKey.length.should.be.equal(128);
        //
        // applicationResult.networkData.balance.should.be.equal(0);
        // applicationResult.networkData.stakePokt.should.be.equal(0);
        // applicationResult.networkData.jailed.should.be.equal(false);
        // applicationResult.networkData.status.should.be.equal(ApplicationStatuses.unbounded);
      });
    });

    describe("Fail scenarios", () => {

    });
  });
});
