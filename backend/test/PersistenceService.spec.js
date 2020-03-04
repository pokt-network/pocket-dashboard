import {after, before, describe, it} from "mocha";
import "chai/register-should";

import {configurations} from "../src/_configuration";
import PersistenceService from "../src/services/data/PersistenceService";
import MongoDBProvider from "../src/services/data/MongoDBProvider";

let mongoDBProvider = null;
let persistenceService = null;

before(() => {
  mongoDBProvider = new MongoDBProvider(configurations.persistence);
  persistenceService = new PersistenceService(mongoDBProvider);
});


after(() => {
  mongoDBProvider = null;
  persistenceService = null;
});

describe('PersistenceService', () => {

  describe('openConnection', () => {
    it('Expected a successfully connection', (done) => {
      persistenceService.openConnection((db) => {
        should.exist(db);
        persistenceService.closeConnection();
        done();
      }, (err) => {
        should.not.exist(err);
        done();
      });
    });
  });


  describe('closeConnection', () => {
    it('Expect close successfully', (done) => {
      mongoDBProvider.close((data) => {
        should.not.exist(data);
        done();
      });
    });
  });
});
