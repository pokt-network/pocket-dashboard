import {after, before, describe, it} from "mocha";
import "chai/register-should";

import {configurations} from "../src/_configuration";
import MongoDBProvider from "../src/services/data/MongoDBProvider";

let mongoDBProvider = null;

before(() => {
  mongoDBProvider = new MongoDBProvider(configurations.persistence);
});


after(() => {
  mongoDBProvider = null;
});

describe('MongoDBProvider', () => {

  describe('open', () => {
    it('Expected a successfully connection', (done) => {
      mongoDBProvider.open((err) => {
        should.not.exist(err);
        mongoDBProvider.close();
        done();
      })
    });
  });

  describe('isOpen', () => {

    it('should return true', (done) => {
      mongoDBProvider.open(() => {
        mongoDBProvider.isOpen().should.equal(true);
        mongoDBProvider.close();
        done();
      });
    });
  });

  describe('close', () => {
    it('Expected close successfully', (done) => {
      mongoDBProvider.close((data) => {
        should.not.exist(data);
        done();
      });
    });
  });

  describe('getDB', () => {
    it('should return Db Object', (done) => {
      mongoDBProvider.open(() => {
        const db = mongoDBProvider.getDB();

        should.exist(db);
        db.should.be.an('object');

        mongoDBProvider.close();

        done();
      });
    });
  });
});
