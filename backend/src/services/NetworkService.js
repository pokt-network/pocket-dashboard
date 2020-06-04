import BasePocketService from "./BasePocketService";
import {Configurations} from "../_configuration";
import {Application, Node, StakingStatus} from "@pokt-network/pocket-js";
import {NetworkSummaryData} from "../models/Network";
import bigInt from "big-integer";

export default class NetworkService extends BasePocketService {

  /**
   * Get the POKT price.
   *
   * @returns {string} POKT price.
   * @private
   */
  __getPOKTPrice() {
    return Configurations.pocket_network.pokt_market_price;
  }

  /**
   * Get Staked nodes.
   *
   * @returns {Promise<Node[]>} Staked node information.
   * @async
   * @private
   */
  async __getStakedNodes() {
    return this.pocketService.getNodes(StakingStatus.Staked);
  }

  /**
   * Get staked applications.
   *
   * @returns {Promise<Application[]>} Staked application information.
   * @async
   * @private
   */
  async __getStakedApplications() {
    return this.pocketService.getApplications(StakingStatus.Staked);
  }

  /**
   * Get total staked tokens.
   *
   * @param {Application[]} totalStakedApps Staked applications.
   * @param {Node[]} totalStakedNodes Staked nodes.
   *
   * @returns {*} Total staked tokens.
   * @private
   */
  __totalStakedTokens(totalStakedApps, totalStakedNodes) {
    const totalStakedAppTokens = this._getTotalNetworkData(totalStakedApps.map(app => bigInt(app.stakedTokens)));
    const totalStakedNodeTokens = this._getTotalNetworkData(totalStakedNodes.map(node => bigInt(node.stakedTokens)));

    return totalStakedAppTokens.add(totalStakedNodeTokens);
  }

  /**
   * Get Summary data from network.
   *
   * @returns {Promise<NetworkSummaryData>} Summary network data.
   * @async
   */
  async getNetworkSummaryData() {
    const poktPrice = this.__getPOKTPrice();
    const stakedApplications = await this.__getStakedApplications();
    const stakedNodes = await this.__getStakedNodes();
    const totalStakedTokens = this.__totalStakedTokens(stakedApplications, stakedNodes);

    return new NetworkSummaryData(poktPrice, totalStakedTokens, stakedNodes.length.toString(), stakedApplications.length.toString());
  }
}
