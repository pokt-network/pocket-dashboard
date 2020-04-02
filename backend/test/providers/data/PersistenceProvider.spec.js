import {before, describe, it} from "mocha";
import "chai/register-should";
import PersistenceProvider from "../../../src/providers/data/PersistenceProvider";
import {configureTestPersistenceProvider} from "../../setupTests";


const persistenceService = new PersistenceProvider();
const ENTITY_NAME = "TestSpecs";

before(() => {
  configureTestPersistenceProvider(persistenceService);
});

describe("PersistenceProvider with MongoDB", () => {

  describe("saveEntity", () => {
    it("Expect save an entity successfully", async () => {
      const testEntity = {
        id: 99999,
        name: "test-example"
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

    it("Expect an array of elements with limit", async () => {

      const limit = 2;
      const testEntities = [
        {
          id: 99999,
          name: "test-example 1"
        },
        {
          id: 99999,
          name: "test-example 2"
        },
        {
          id: 99999,
          name: "test-example 3"
        },
        {
          id: 99999,
          name: "test-example 4"
        },
        {
          id: 99999,
          name: "test-example 5"
        }
      ];

      for (const testEntity of testEntities) {
        await persistenceService.saveEntity(ENTITY_NAME, testEntity);
      }

      const entities = await persistenceService.getEntities(ENTITY_NAME, {}, limit);

      // eslint-disable-next-line no-undef
      should.exist(entities);
      entities.should.be.an("array");
      entities.length.should.be.equal(limit);
    });

    it("Expect an array of elements with offset and limit", async () => {

      const limit = 3;
      const offset = 2;
      const expectedID = 99998;
      const testEntities = [
        {
          id: 99999,
          name: "test-example 1"
        },
        {
          id: expectedID,
          name: "test-example 2"
        },
        {
          id: 99997,
          name: "test-example 3"
        },
        {
          id: 99996,
          name: "test-example 4"
        },
        {
          id: 99995,
          name: "test-example 5"
        }
      ];

      await persistenceService.deleteEntities(ENTITY_NAME, {});
      for (const testEntity of testEntities) {
        await persistenceService.saveEntity(ENTITY_NAME, testEntity);
      }

      const entities = await persistenceService.getEntities(ENTITY_NAME, {}, limit, offset);
      const entity = entities[0];

      // eslint-disable-next-line no-undef
      should.exist(entities);
      // eslint-disable-next-line no-undef
      should.exist(entity);

      entities.should.be.an("array");
      entities.length.should.be.equal(limit);

      entity.should.be.an("object");
      entity.id.should.be.equal(expectedID);
    });
  });

  describe("getElementByID", () => {
    it("Expect an object of element", async () => {
      const testEntity = {
        id: 99999,
        name: "test-example"
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
        name: "test-example"
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
        name: "test-example"
      };
      const dataToUpdate = {
        name: "test-exampleUpdated"
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
        name: "test-example"
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
