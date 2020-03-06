import PersistenceService from "./data/PersistenceService";
import MongoDBAdapter from "./data/MongoDBAdapter";
import {configurations} from "../_configuration";

class BaseService {
  constructor() {
    this._persistenceService = new PersistenceService(new MongoDBAdapter(configurations.persistence));
  }
}

export default BaseService;
