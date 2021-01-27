import {PocketTransaction} from "./Transaction";

export const BOND_STATUS = {
    2: "Staked",
    1: "Unstaking",
    0: "Unstaked",
};

export const STAKE_STATUS = {
    Staked: "Staked",
    Unstaking: "Unstaking",
    Unstaked: "Unstaked",
    "2": "Staked",
    "1": "Unstaking",
    "0": "Unstaked",
};

export class CronJobData {

    /**
     * @param {string} id The ID of the entity.
     * @param {number} lastHeight The last block height.
     * @param {[PocketTransaction]} pendingTransactions List of Pending Transactions.
     * @param {[PocketTransaction]} appStakeTransactions List of AppStake Transactions.
     * @param {[PocketTransaction]} nodeStakeTransactions List of NodeStake Transactions.
     * @param {[PocketTransaction]} appUnstakeTransactions List of AppUnstake Transactions.
     * @param {[PocketTransaction]} nodeUnstakeTransactions List of NodeUnstake Transactions.
     * @param {[PocketTransaction]} nodeUnjailTransactions List of NodeUnjail Transactions.
     */
    constructor(id, lastHeight, pendingTransactions, appStakeTransactions, nodeStakeTransactions, appUnstakeTransactions, nodeUnstakeTransactions, nodeUnjailTransactions) {
        Object.assign(this, {id, lastHeight, pendingTransactions, appStakeTransactions, nodeStakeTransactions, appUnstakeTransactions, nodeUnstakeTransactions, nodeUnjailTransactions});
    }

    static newInstance(dbArray) {
        const cronJobData = new CronJobData();
        const data = dbArray[0];

        cronJobData.id = data.id;
        cronJobData.lastHeight = data.lastHeight;
        cronJobData.pendingTransactions = data.pendingTransactions ?? [];
        cronJobData.appStakeTransactions = data.appStakeTransactions ?? [];
        cronJobData.nodeStakeTransactions = data.nodeStakeTransactions ?? [];
        cronJobData.appUnstakeTransactions = data.appUnstakeTransactions ?? [];
        cronJobData.nodeUnstakeTransactions = data.nodeUnstakeTransactions ?? [];
        cronJobData.nodeUnjailTransactions = data.nodeUnjailTransactions ?? [];
        
        return cronJobData;
    }
}