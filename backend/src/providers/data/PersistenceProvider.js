import {get_default_db_provider} from "./db";

class PersistenceProvider {
  constructor() {
    this.__dbProvider = get_default_db_provider();
  }

  /**
   * @return {Promise<MongoClient>}
   * @private
   */
  __openConnection() {
    return this.__dbProvider.open();
  }

  /**
   * @param {MongoClient} dbConnection
   *
   * @return {Db}
   * @private
   */
  __getDB(dbConnection) {
    return this.__dbProvider.getDB(dbConnection);
  }

  /**
   * @param {MongoClient} dbConnection
   */
  closeConnection(dbConnection) {
    this.__dbProvider.close(dbConnection);
  }

  /**
   * @param {string} entityName Collection name of entities.
   *
   * @return {Promise<Collection>}
   */
  async getCollection(entityName) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);

    return db.collection(entityName);
  }

  /**
   * @param {string} entityName Collection name of entities.
   * @param {Object} filter Filter used to retrieve elements.
   *
   * @return {Promise<Object[]>}
   */
  async getEntities(entityName, filter = {}) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);
    const collection = db.collection(entityName);

    const data = await collection.find(filter).toArray();
    this.closeConnection(connection);

    return data;
  }

  /**
   * @param {string} entityName Collection name of entities.
   * @param {string} entityID Entity ID used to retrieve element.
   *
   * @return {Promise<Object>}
   */
  async getEntityByID(entityName, entityID) {
    const filter = {
      _id: entityID
    };

    const data = await this.getEntities(entityName, filter);

    return data[0];
  }

  /**
   * @param {string} entityName Collection name of entities.
   * @param {Object} filter Filter used to retrieve elements.
   *
   * @return {Promise<Object>}
   */
  async getEntityByFilter(entityName, filter) {

    const data = await this.getEntities(entityName, filter);

    return data[0];
  }

  /**
   * @param {string} entityName Collection name of entities.
   * @param {Object} entity Entity object to save.
   *
   * @return {Promise<Object>}
   */
  async saveEntity(entityName, entity) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);
    const collection = db.collection(entityName);

    const result = await collection.insertOne(entity);
    this.closeConnection(connection);

    return result;
  }

  /**
   * @param {string} entityName Collection name of entities.
   * @param {Object} filter Filter used to update elements.
   * @param {Object} data Data object to update.
   *
   * @return {Promise<*>}
   */
  async updateEntity(entityName, filter, data) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);
    const collection = db.collection(entityName);

    const result = await collection.updateOne(filter, {$set: data});
    this.closeConnection(connection);

    return result;
  }

  /**
   * @param {string} entityName Collection name of entities.
   * @param {Object} filter Filter used to delete elements.
   *
   * @return {Promise<*>}
   */
  async deleteEntities(entityName, filter) {
    const connection = await this.__openConnection();
    const db = this.__getDB(connection);
    const collection = db.collection(entityName);

    const result = await collection.deleteMany(filter);
    this.closeConnection(connection);

    return result;
  }

  /**
   * @param {string} entityName Collection name of entities.
   * @param {string} entityID Entity ID used to delete element.
   *
   * @return {Promise<Object>}
   */
  async deleteEntityByID(entityName, entityID) {
    const filter = {
      _id: entityID
    };

    return await this.deleteEntities(entityName, filter);
  }
}

export default PersistenceProvider;
