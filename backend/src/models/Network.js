import {Chains} from "../providers/NetworkChains";

export class NetworkChain {

  /**
   * @param {string} netID Network Identifier.
   * @param {string} ticker Ticker.
   * @param {string} name Name.
   * @param {string} description Description.
   * @param {string} hash Hash.
   */
  constructor(netID, ticker, name, description, hash) {
    Object.assign(this, {netID, ticker, name, description, hash});
  }

  /**
   * Get available network chains.
   *
   * @returns {NetworkChain[]} Network chains in Pocket.
   * @static
   */
  static getAvailableNetworkChains() {
    return Chains.map(chain => new NetworkChain(chain.netID, chain.ticker, chain.name, chain.description, chain.hash));
  }

  /**
   * Get Network chains from hashes.
   *
   * @param {string[]} networkHashes Network hashes.
   *
   * @returns {NetworkChain[]} Network chains in Pocket.
   * @static
   */
  static getNetworkChains(networkHashes) {
    if(networkHashes === undefined) {
      return [];
    } else {
      return Chains
        .filter(chain => networkHashes.includes(chain.hash))
        .map(chain => new NetworkChain(chain.netID, chain.ticker, chain.name, chain.description, chain.hash));
    }
  }
}

export class NetworkSummaryData {
  /**
   * @param {string} poktPrice POKT price
   * @param {string} totalStakedTokens Total staked tokens.
   * @param {string} totalStakedNodes Total staked nodes.
   * @param {string} totalStakedApps Total staked apps.
   */
  constructor(poktPrice, totalStakedTokens, totalStakedNodes, totalStakedApps) {
    Object.assign(this, {poktPrice, totalStakedTokens, totalStakedApps, totalStakedNodes});
  }
}
