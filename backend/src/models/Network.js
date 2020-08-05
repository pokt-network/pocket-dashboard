export class NetworkChain {

  /**
   * @param {string} networkID Network Identifier.
   * @param {string} ticker Ticker.
   * @param {string} name Name.
   * @param {string} description Description.
   * @param {string} hash Hash.
   */
  constructor(networkID, ticker, name, description, hash) {
    Object.assign(this, {networkID, ticker, name, description, hash});
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
