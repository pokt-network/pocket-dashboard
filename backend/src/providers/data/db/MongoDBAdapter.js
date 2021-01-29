import { Db, MongoClient } from "mongodb";

export default class MongoDBAdapter {
  /**
   * @param {object} properties Properties of MongoDB.
   * @param {string} properties.url URL of MongoDB instance.
   * @param {object} properties.options Options of MongoDB instance.
   * @param {string} properties.db_name Database name of MongoDB instance.
   */
  constructor(properties) {
    this.properties = properties;
  }

  /**
   * Open a connection to MongoDB.
   *
   * @returns {Promise<MongoClient>} MongoDB Client.
   */
  open() {
    return MongoClient.connect(this.properties.url, this.properties.options);
  }

  /**
   * Close active connection.
   *
   * @param {MongoClient} connection Connection to close.
   *
   * @returns {*} The result of close operation from MongoDB.
   */
  close(connection) {
    return connection.close();
  }

  /**
   * Get DB from MongoDB.
   *
   * @param {MongoClient} connection Connection to retrieve the DB.
   *
   * @returns {Db} Database instance.
   */
  getDB(connection) {
    return connection.db(this.properties.db_name);
  }

}
