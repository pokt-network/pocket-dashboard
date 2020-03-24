import {after, before, describe, it} from "mocha";
import "chai/register-should";

import {Configurations} from "../../../src/_configuration";
import PersistenceProvider from "../../../src/providers/data/PersistenceProvider";
import MongoDBAdapter from "../../../src/providers/data/db/MongoDBAdapter";
import * as dbProvider from "../../../src/providers/data/db/Index";
import sinon from "sinon";

/** @type MongoDBAdapter */
let mongoDBProvider = null;

/** @type PersistenceProvider */
let persistenceService = null;

const ENTITY_NAME = "TestSpecs";

before(() => {
  mongoDBProvider = new MongoDBAdapter(Configurations.persistence.test);
  sinon.stub(dbProvider, "get_default_db_provider").returns(mongoDBProvider);

  persistenceService = new PersistenceProvider();
});


after(() => {
  persistenceService.deleteEntities(ENTITY_NAME, {}).then(async () => {
    const collection = await persistenceService.getCollection(ENTITY_NAME);
    await collection.drop();

    mongoDBProvider = null;
    persistenceService = null;
  });
});

describe("PersistenceProvider with MongoDB", () => {

  describe("saveEntity", () => {
    it("Expect save an entity successfully", async () => {
      const testEntity = {
        id: 99999,
        name: "tests-example"
      };

      const result = await persistenceService.saveEntity(ENTITY_NAME, testEntity);

      // eslint-disable-next-line no-undef
      should.exist(result);

      result.result.should.be.an("object");
      result.insertedCount.should.equal(1);
    });
  });

  describe("getElements", () => {
    it("Expect an array of elements", async () => {

      const entities = await persistenceService.getEntities(ENTITY_NAME);

      // eslint-disable-next-line no-undef
      should.exist(entities);
      entities.should.be.an("array");
    });
  });

  describe("getElementByID", () => {
    it("Expect an object of element", async () => {
      const testEntity = {
        id: 99999,
        name: "tests-example"
      };

      const result = await persistenceService.saveEntity(ENTITY_NAME, testEntity);
      const entity = await persistenceService.getEntityByID(ENTITY_NAME, result.insertedId);

      // eslint-disable-next-line no-undef
      should.exist(entity);

      entity.id.should.equal(testEntity.id);
      entity.name.should.equal(testEntity.name);
    });
  });


  describe("getEntityByFilter", () => {
    it("Expect an object of element", async () => {
      const testEntity = {
        id: 99999,
        name: "tests-example"
      };

      await persistenceService.saveEntity(ENTITY_NAME, testEntity);
      const entity = await persistenceService.getEntityByFilter(ENTITY_NAME, {name: testEntity.name});

      // eslint-disable-next-line no-undef
      should.exist(entity);

      entity.id.should.equal(testEntity.id);
      entity.name.should.equal(testEntity.name);
    });
  });

  describe("updateEntity", () => {
    it("Expect and element updated", async () => {
      const testEntity = {
        id: 99999,
        name: "tests-example"
      };
      const dataToUpdate = {
        name: "tests-exampleUpdated"
      };

      await persistenceService.saveEntity(ENTITY_NAME, testEntity);
      await persistenceService.updateEntity(ENTITY_NAME, {id: testEntity.id}, dataToUpdate);

      const entity = await persistenceService.getEntityByFilter(ENTITY_NAME, {id: testEntity.id});

      // eslint-disable-next-line no-undef
      should.exist(entity);

      entity.id.should.equal(testEntity.id);
      entity.name.should.equal(dataToUpdate.name);
    });
  });

  describe("deleteEntityByID", () => {
    it("Expect deleted an element successfully", async () => {
      const testEntity = {
        id: 99999,
        name: "tests-example"
      };

      const result = await persistenceService.saveEntity(ENTITY_NAME, testEntity);
      const deleteResult = await persistenceService.deleteEntityByID(ENTITY_NAME, result.insertedId);

      // eslint-disable-next-line no-undef
      should.exist(deleteResult);

      deleteResult.result.should.be.an("object");
      deleteResult.deletedCount.should.equal(1);
    });
  });
});
