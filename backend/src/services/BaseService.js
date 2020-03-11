import PersistenceService from "./data/PersistenceService";
import MongoDBAdapter from "./data/MongoDBAdapter";
import {Configurations} from "../_configuration";

class BaseService {
  constructor() {
    this._persistenceService = new PersistenceService(new MongoDBAdapter(Configurations.persistence));
  }
}

export default BaseService;
