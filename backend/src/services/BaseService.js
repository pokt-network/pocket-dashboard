import MongoDBService from "./MongoDBService";
import {configurations} from "../_configuration";

class BaseService {
  constructor() {
    this.persistanceService = new MongoDBService(configurations.database);
  }
}

export default BaseService;
