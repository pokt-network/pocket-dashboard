import {after, before} from "mocha";
import MongoDBAdapter from "../../src/providers/data/db/MongoDBAdapter";
import PersistenceProvider from "../../src/providers/data/PersistenceProvider";
import {Configurations} from "../../src/_configuration";
import sinon from "sinon";
import * as dbProvider from "../../src/providers/data/db";
import * as pocket from "../../src/services/PocketService";

/** @type {PersistenceProvider} */
let persistenceService = null;

let mongoDBProvider = new MongoDBAdapter(Configurations.persistence.test);

sinon.stub(dbProvider, "get_default_db_provider").returns(mongoDBProvider);
sinon.stub(pocket, "get_default_pocket_network").returns(Configurations.pocketNetwork.nodes.test);

before(() => {
  persistenceService = new PersistenceProvider();
});


after(async () => {

  await persistenceService.dropDataBase();

  mongoDBProvider = null;
  persistenceService = null;
});
