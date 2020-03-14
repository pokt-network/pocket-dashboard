import {MongoClient} from "mongodb";

class MongoDBAdapter {
  /**
   *
   * @param {object} properties
   * @param {string} properties.url
   * @param {object} properties.options
   * @param {string} properties.dbName
   */
  constructor(properties) {
    this.properties = properties;
  }

  /**
   * Open a connection to MongoDB.
   *
   * @return {Promise<MongoClient>}
   */
  open() {
    return MongoClient.connect(this.properties.url, this.properties.options);
  }

  /**
   * Close active connection.
   *
   * @param {MongoClient} connection Connection to close.
   *
   * @return {*}
   */
  close(connection) {
    return connection.close();
  }

  /**
   * Get DB from MongoDB.
   *
   * @param {MongoClient} connection Connection to retrieve the DB.
   *
   * @return {*}
   */
  getDB(connection) {
    return connection.db(this.properties.dbName);
  }

}

export default MongoDBAdapter;
