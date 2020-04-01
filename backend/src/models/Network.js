import {Configurations} from "../_configuration";

export class NetworkChain {

  /**
   * @param {string} name Name.
   * @param {string} netID Network Identifier.
   * @param {string} hash Hash.
   */
  constructor(name, netID, hash) {
    Object.assign(this, {name, netID, hash});
  }

  /**
   * Get available network chains.
   *
   * @returns {NetworkChain[]} Network chains in Pocket.
   * @static
   */
  static getAvailableNetworkChains() {
    /** @type {{name:string, netID:string, hash:string}[]} */
    const chains = Configurations.pocketNetwork.chains;

    return chains.map(chain => new NetworkChain(chain.name, chain.netID, chain.hash));
  }
}
