import {after, before} from "mocha";
import MongoDBAdapter from "../src/providers/data/db/MongoDBAdapter";
import PersistenceProvider from "../src/providers/data/PersistenceProvider";
import {Configurations} from "../src/_configuration";
import sinon from "sinon";
import * as pocket from "../src/services/PocketService";

let mongoDBProvider = new MongoDBAdapter(Configurations.persistence.test);

/** @type {PersistenceProvider} */
let persistenceService = null;

sinon.stub(pocket, "get_default_pocket_network").returns(Configurations.pocketNetwork.nodes.test);

before(() => {
  persistenceService = new PersistenceProvider();
  sinon.stub(persistenceService, "dbProvider").value(mongoDBProvider);
});

after(async () => {
  await persistenceService.dropDataBase();

  mongoDBProvider = null;
  persistenceService = null;
});
