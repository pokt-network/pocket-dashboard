import PersistenceService from "./data/PersistenceService";

class BaseService {
  constructor(provider) {
    this._persistenceService = new PersistenceService(provider);
  }
}

export default BaseService;
