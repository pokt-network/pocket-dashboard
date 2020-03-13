import {after, before, describe, it} from "mocha";
import "chai/register-should";

import {Configurations} from "../../../src/_configuration";
import PersistenceService from "../../../src/services/data/PersistenceService";
import MongoDBAdapter from "../../../src/services/data/MongoDBAdapter";

let mongoDBProvider = null;
let persistenceService = null;

const entityName = "TestSpecs";

before(() => {
  mongoDBProvider = new MongoDBAdapter(Configurations.persistence);
  persistenceService = new PersistenceService(mongoDBProvider);
});


after(() => {
  persistenceService.deleteEntities(entityName, {}).then(() => {
    mongoDBProvider = null;
    persistenceService = null;
  });
});

describe("PersistenceService", () => {

  describe("saveEntity", () => {
    it("Expect save an entity successfully", async () => {
      const testEntity = {
        id: 99999,
        name: "tests-example"
      };

      const result = await persistenceService.saveEntity(entityName, testEntity);

      // eslint-disable-next-line no-undef
      should.exist(result);

      result.result.should.be.an("object");
      result.insertedCount.should.equal(1);
    });
  });

  describe("getElements", () => {
    it("Expect an array of elements", async () => {

      const entities = await persistenceService.getEntities(entityName);

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

      const result = await persistenceService.saveEntity(entityName, testEntity);
      const entity = await persistenceService.getEntityByID(entityName, result.insertedId);

      // eslint-disable-next-line no-undef
      should.exist(entity);

      entity.id.should.equal(testEntity.id);
      entity.name.should.equal(testEntity.name);
    });
  });

  describe("deleteEntityByID", () => {
    it("Expect deleted an element successfully", async () => {
      const testEntity = {
        id: 99999,
        name: "tests-example"
      };

      const result = await persistenceService.saveEntity(entityName, testEntity);
      const deleteResult = await persistenceService.deleteEntityByID(entityName, result.insertedId);

      // eslint-disable-next-line no-undef
      should.exist(deleteResult);

      deleteResult.result.should.be.an("object");
      deleteResult.deletedCount.should.equal(1);
    });
  });
});
