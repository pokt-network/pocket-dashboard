import TransactionService from "./services/TransactionService";
import PocketService from "./services/PocketService";
import EmailService from "./services/EmailService";
import NodeService from "./services/NodeService";
import CronJobService from "./services/CronJobService";
import ApplicationService from "./services/ApplicationService";
import cron from "node-cron";

import {RpcError, typeGuard} from "@pokt-network/pocket-js";
import {POST_ACTION_TYPE} from "./models/Transaction";
import {BOND_STATUS, STAKE_STATUS} from "./models/CronJobData";

export function startCronJobs() {
    const TRANSACTION_SERVICE = new TransactionService();
    const POCKET_SERVICE = new PocketService();
    const APPLICATION_SERVICE = new ApplicationService();
    const NODE_SERVICE = new NodeService();
    const CRON_SERVICE = new CronJobService();

    cron.schedule("0 */20 * * * *", async () => {
        let height = await POCKET_SERVICE.getBlockHeight();
        const cronJobData = await CRON_SERVICE.getEntity();

        height = Number(height);

        if (height !== cronJobData.lastHeight) {
            runPendingTransaction(cronJobData);
            runNodeStakeProcess(cronJobData);
            runNodeUnstakeProcess(cronJobData);
            runAppStakeProcess(cronJobData);
            runAppUnstakeProcess(cronJobData);

            runNodeUnjailProcess(cronJobData);

            cronJobData.lastHeight = height;
            CRON_SERVICE.update(cronJobData.id, cronJobData);
        }
    });

    function runPendingTransaction(cronJobData) {
        const start = async () => {
            await asyncForEach(cronJobData.pendingTransactions, async (pocketTransaction) => {
                try {
                    const hash = pocketTransaction.hash;
                    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

                    if (typeGuard(transactionOrError, RpcError)) {
                        throw new Error(transactionOrError.message);
                    }

                    const transaction = transactionOrError;

                    if (transaction.hash === hash) {
                        const markedTransactionSuccess = await TRANSACTION_SERVICE.markTransactionSuccess(pocketTransaction);

                        if (markedTransactionSuccess) {

                            if (pocketTransaction.postAction && pocketTransaction.postAction !== {}) {
                                const postAction = pocketTransaction.postAction;

                                switch (postAction.type) {
                                    case POST_ACTION_TYPE.stakeApplication: {
                                        const appStakeTransaction = postAction.data.appStakeTransaction;
                                        const stakeAppPostActionHash = await POCKET_SERVICE.submitRawTransaction(appStakeTransaction.address, appStakeTransaction.raw_hex_bytes);

                                        await TRANSACTION_SERVICE.addAppStakeTransaction(stakeAppPostActionHash, postAction.data);
                                        await CRON_SERVICE.removePendingTransaction(pocketTransaction);
                                        break;
                                    }
                                    case POST_ACTION_TYPE.stakeNode: {
                                        const nodeStakeTransaction = postAction.data.nodeStakeTransaction;
                                        const stakeNodePostActionHash = await POCKET_SERVICE.submitRawTransaction(nodeStakeTransaction.address, nodeStakeTransaction.raw_hex_bytes);

                                        await TRANSACTION_SERVICE.addNodeStakeTransaction(stakeNodePostActionHash, postAction.data);
                                        await CRON_SERVICE.removePendingTransaction(pocketTransaction);
                                        break;
                                    }
                                    default:
                                        throw new Error(`Invalid Post Action: ${JSON.stringify(postAction)}`);
                                }
                            }
                        } else {
                            throw new Error("Failed to mark transaction as success/completed.");
                        }
                    }
                } catch (e) {
                    throw new Error(e);
                }
            });
        };

        start();
    }

    function runAppStakeProcess(cronJobData) {
        const start = async () => {
            await asyncForEach(cronJobData.appStakeTransactions, async (applicationStakePocketTransaction) => {
                try {
                    const hash = applicationStakePocketTransaction.hash;
                    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

                    if (typeGuard(transactionOrError, RpcError)) {
                        throw new Error(transactionOrError.message);
                    }

                    const postAction = applicationStakePocketTransaction.postAction;

                    const {
                        address,
                        contactEmail,
                        emailData,
                        paymentEmailData
                    } = postAction.data;

                    const {
                        pocketApp,
                        networkData,
                        error,
                        name
                    } = await APPLICATION_SERVICE.getApplication(address);

                    const hasError = error ? error : false;
                    const errorType = error ? name : "";

                    if (hasError || pocketApp === undefined) {
                        throw new Error(errorType);
                    }

                    const status = getStakeStatus(parseInt(networkData.status));

                    if (status === STAKE_STATUS.Staked) {
                        await EmailService
                            .to(contactEmail)
                            .sendStakeNodeEmail(contactEmail, emailData, paymentEmailData);

                        APPLICATION_SERVICE.changeUpdatingStatus(address, false);

                        await CRON_SERVICE.removeAppStakeTransaction(applicationStakePocketTransaction);
                    }
                } catch (e) {
                    throw new Error(e);
                }
            });
        };

        start();
    }

    function runNodeStakeProcess(cronJobData) {
        const start = async () => {
            await asyncForEach(cronJobData.nodeStakeTransactions, async (nodeStakePocketTransaction) => {
                try {
                    const hash = nodeStakePocketTransaction.hash;
                    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

                    if (typeGuard(transactionOrError, RpcError)) {
                        throw new Error(transactionOrError.message);
                    }

                    const postAction = nodeStakePocketTransaction.postAction;

                    const {
                        address,
                        contactEmail,
                        emailData,
                        paymentEmailData
                    } = postAction.data;

                    const {
                        pocketNode,
                        networkData,
                        error,
                        name
                    } = await NODE_SERVICE.getNode(address);

                    const hasError = error ? error : false;
                    const errorType = error ? name : "";

                    if (hasError || pocketNode === undefined) {
                        throw new Error(errorType);
                    }

                    const status = getStakeStatus(parseInt(networkData.status));

                    if (status === STAKE_STATUS.Staked) {
                        await EmailService
                            .to(contactEmail)
                            .sendStakeNodeEmail(contactEmail, emailData, paymentEmailData);

                        NODE_SERVICE.changeUpdatingStatus(address, false);

                        await CRON_SERVICE.removeNodeStakeTransaction(nodeStakePocketTransaction);
                    }
                } catch (e) {
                    throw new Error(e);
                }
            });
        };

        start();
    }

    function runAppUnstakeProcess(cronJobData) {
        const start = async () => {
            await asyncForEach(cronJobData.appUnstakeTransactions, async (appUnstakePocketTransaction) => {
                try {
                    const hash = appUnstakePocketTransaction.hash;
                    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

                    if (typeGuard(transactionOrError, RpcError)) {
                        throw new Error(transactionOrError.message);
                    }

                    // Submit App Stake Email
                    const postAction = appUnstakePocketTransaction.postAction;

                    const {contactEmail, userName, applicationData, address} = postAction.data;

                    const {
                        pocketApp,
                        networkData,
                        error,
                        name
                    } = await APPLICATION_SERVICE.getApplication(address);

                    const hasError = error ? error : false;
                    const errorType = error ? name : "";

                    if (hasError || pocketApp === undefined) {
                        throw new Error(errorType);
                    }

                    const status = getStakeStatus(parseInt(networkData.status));

                    if (status === STAKE_STATUS.Unstaked) {
                        await EmailService
                            .to(contactEmail)
                            .sendUnstakeAppEmail(userName, applicationData);

                        APPLICATION_SERVICE.changeUpdatingStatus(address, false);

                        await CRON_SERVICE.removeAppUnstakeTransaction(appUnstakePocketTransaction);
                    }
                } catch (e) {
                    throw new Error(e);
                }
            });
        };

        start();
    }

    function runNodeUnstakeProcess(cronJobData) {
        const start = async () => {
            await asyncForEach(cronJobData.nodeUnstakeTransactions, async (nodeUnstakeTransaction) => {
                try {
                    const hash = nodeUnstakeTransaction.hash;
                    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

                    if (typeGuard(transactionOrError, RpcError)) {
                        throw new Error(transactionOrError.message);
                    }

                    const postAction = nodeUnstakeTransaction.postAction;
                    const {contactEmail, userName, nodeData, address} = postAction.data;

                    const {
                        pocketNode,
                        networkData,
                        error,
                        name
                    } = await NODE_SERVICE.getNode(address);

                    const hasError = error ? error : false;
                    const errorType = error ? name : "";

                    if (hasError || pocketNode === undefined) {
                        throw new Error(errorType);
                    }

                    const status = getStakeStatus(parseInt(networkData.status));

                    if (status === STAKE_STATUS.Unstaked) {
                        await EmailService
                            .to(contactEmail)
                            .sendUnstakeNodeEmail(userName, nodeData);

                        NODE_SERVICE.changeUpdatingStatus(address, false);

                        await CRON_SERVICE.removeNodeUnstakeTransaction(nodeUnstakeTransaction);
                    }
                } catch (e) {
                    throw new Error(e);
                }
            });
        };

        start();
    }

    function runNodeUnjailProcess(cronJobData) {
        const start = async () => {
            await asyncForEach(cronJobData.nodeUnjailTransactions, async (nodeUnjailTransaction) => {
                try {
                    const hash = nodeUnjailTransaction.hash;
                    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

                    if (typeGuard(transactionOrError, RpcError)) {
                        throw new Error(transactionOrError.message);
                    }

                    const postAction = nodeUnjailTransaction.postAction;
                    const {contactEmail, userName, nodeData} = postAction.data;

                    await EmailService
                        .to(contactEmail)
                        .sendNodeUnJailedEmail(userName, nodeData);

                    await CRON_SERVICE.removeNodeUnjailTransaction(nodeUnjailTransaction);

                } catch (e) {
                    throw new Error(e);
                }
            });
        };

        start();
    }

    async function asyncForEach(array, callback) {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array);
        }
    }

    function getStakeStatus(status) {
        return typeof status === "string"
            ? STAKE_STATUS[status]
            : BOND_STATUS[status];
    }
}