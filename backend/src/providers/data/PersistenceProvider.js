import {get_default_db_provider} from "./db";

class PersistenceProvider {
  constructor() {
    this.__dbProvider = get_default_db_provider();
  }

  __openConnection() {
    return this.__dbProvider.open();
  }

  closeConnection(dbConnection) {
    this.__dbProvider.close(dbConnection);
  }

  __getDB(dbConnection) {
    return this.__dbProvider.getDB(dbConnection);
  }

  /**
   * Get Collection of entities.
   *
   * @param {string} entityName Entity name.
   * @return {Promise<*>}
   */
  async getCollection(entityName) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);

    return db.collection(entityName);
  }

  async getEntities(entityName, filter = {}) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);
    const collection = db.collection(entityName);

    const data = await collection.find(filter).toArray();
    this.closeConnection(connection);

    return data;
  }

  async getEntityByID(entityName, entityID) {
    const filter = {
      _id: entityID
    };

    const data = await this.getEntities(entityName, filter);

    return data[0];
  }

  async saveEntity(entityName, entity) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);
    const collection = db.collection(entityName);

    const result = await collection.insertOne(entity);
    this.closeConnection(connection);

    return result;
  }

  async deleteEntities(entityName, filter) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);
    const collection = db.collection(entityName);

    const result = await collection.deleteMany(filter);
    this.closeConnection(connection);

    return result;
  }

  async deleteEntityByID(entityName, entityID) {
    const filter = {
      _id: entityID
    };

    return await this.deleteEntities(entityName, filter);
  }
}

export default PersistenceProvider;
