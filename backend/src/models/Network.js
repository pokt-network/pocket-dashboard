export class NetworkChain {

  /**
   * @param {string} name Name.
   * @param {string} netID Network Identifier.
   * @param {string} hash Hash.
   */
  constructor(name, netID, hash) {
    Object.assign(this, {name, netID, hash});
  }

}
