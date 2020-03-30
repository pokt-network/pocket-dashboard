import {after, before} from "mocha";
import MongoDBAdapter from "../src/providers/data/db/MongoDBAdapter";
import PersistenceProvider from "../src/providers/data/PersistenceProvider";
import {Configurations} from "../src/_configuration";
import sinon from "sinon";
import BaseService from "../src/services/BaseService";
import PocketService from "../src/services/PocketService";

const testPocketService = new PocketService(Configurations.pocketNetwork.nodes.test);
const testMongoDBProvider = new MongoDBAdapter(Configurations.persistence.test);
const testPersistenceService = new PersistenceProvider();

before(() => {
  configureTestPersistenceProvider(testPersistenceService);
});

after(async () => {
  await testPersistenceService.dropDataBase();
});

/**
 * @param {BaseService} service Service to configure to test.
 */
export function configureTestService(service) {
  sinon.stub(service, "persistenceService").value(testPersistenceService);
  sinon.stub(service, "pocketService").value(testPocketService);
}

/**
 *
 * @param {PersistenceProvider} persistenceProvider Persistence provider to configure to test.
 */
export function configureTestPersistenceProvider(persistenceProvider) {
  sinon.stub(persistenceProvider, "dbProvider").value(testMongoDBProvider);
}
