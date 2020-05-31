import PersistenceProvider from "../providers/data/PersistenceProvider";

/**
 *  @abstract
 */
export default class BaseService {
  constructor() {
    this.persistenceService = new PersistenceProvider();
  }
}
