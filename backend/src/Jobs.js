import TransactionService from "./services/TransactionService";
import PocketService from "./services/PocketService";
import JobsProvider from "./providers/data/JobsProvider";
import {RpcError, typeGuard} from "@pokt-network/pocket-js";
import EmailService from "./services/EmailService";
import NodeService from "./services/NodeService";
import ApplicationService from "./services/ApplicationService";
import {POST_ACTION_TYPE} from "./models/Transaction";

const TRANSACTION_SERVICE = new TransactionService();
const POCKET_SERVICE = new PocketService();
const APPLICATION_SERVICE = new ApplicationService();
const NODE_SERVICE = new NodeService();

const POST_TRANSFER_QUEUE = JobsProvider.getPostTransferJobQueue();
const APP_STAKE_QUEUE = JobsProvider.getAppStakeJobQueue();
const APP_UNSTAKE_QUEUE = JobsProvider.getAppUnstakeJobQueue();
const NODE_STAKE_QUEUE = JobsProvider.getNodeStakeJobQueue();
const NODE_UNSTAKE_QUEUE = JobsProvider.getNodeUnstakeJobQueue();
const NODE_UNJAIL_QUEUE = JobsProvider.getNodeUnJailJobQueue();

// NODE_STAKE_QUEUE
NODE_STAKE_QUEUE.process(async (job, done) => {
  try {
    // Parse the transaction data
    const nodeStakePocketTransaction = job.data;

    // Get the transaction hash to verify
    const hash = nodeStakePocketTransaction.hash;

    // Try to get the transaction from the network
    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

    if (typeGuard(transactionOrError, RpcError)) {
      done(new Error(transactionOrError.message));
      return;
    }

    // Submit Node Stake Email
    const postAction = nodeStakePocketTransaction.postAction;

    if (!postAction || postAction.type !== POST_ACTION_TYPE.stakeNode) {
      done(new Error("Invalid Post Action Type: " + JSON.stringify(postAction)));
      return;
    }

    const {
      address,
      contactEmail,
      emailData,
      paymentEmailData
    } = postAction.data;

    await EmailService
      .to(contactEmail)
      .sendStakeNodeEmail(contactEmail, emailData, paymentEmailData);

    if (address !== null && address !== undefined) {
      NODE_SERVICE.changeUpdatingStatus(address, false);
    }

    // Finish the job OK
    done();
  } catch (e) {
    done(e);
  }
});

// NODE_UNSTAKE_QUEUE
NODE_UNSTAKE_QUEUE.process(async (job, done) => {
  try {
    // Parse the transaction from the job
    const nodeUnstakeTransaction = job.data;

    // Get the transaction hash to verify
    const hash = nodeUnstakeTransaction.hash;

    // Try to get the transaction from the network
    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

    if (typeGuard(transactionOrError, RpcError)) {
      done(new Error(transactionOrError.message));
      return;
    }

    // Submit App Stake Email
    const postAction = nodeUnstakeTransaction.postAction;

    if (!postAction || postAction.type !== POST_ACTION_TYPE.unstakeNode) {
      done(new Error("Invalid Post Action Type: " + JSON.stringify(postAction)));
      return;
    }

    const {contactEmail, userName, nodeData, address} = postAction.data;

    await EmailService
      .to(contactEmail)
      .sendUnstakeNodeEmail(userName, nodeData);

    if (address !== null && address !== undefined) {
      NODE_SERVICE.changeUpdatingStatus(address, false);
    }
    // Finish the job OK
    done();
  } catch (error) {
    done(error);
  }
});

// NODE_UNJAIL_QUEUE
NODE_UNJAIL_QUEUE.process(async (job, done) => {
  try {
    // Parse the transaction from the job
    const nodeUnjailTransaction = job.data;

    // Get the transaction hash to verify
    const hash = nodeUnjailTransaction.hash;

    // Try to get the transaction from the network
    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

    if (typeGuard(transactionOrError, RpcError)) {
      done(new Error(transactionOrError.message));
      return;
    }

    // Submit App Stake Email
    const postAction = nodeUnjailTransaction.postAction;

    if (!postAction || postAction.type !== POST_ACTION_TYPE.unjailNode) {
      done(new Error("Invalid Post Action Type: " + JSON.stringify(postAction)));
      return;
    }

    const {contactEmail, userName, nodeData} = postAction.data;

    await EmailService
      .to(contactEmail)
      .sendNodeUnJailedEmail(userName, nodeData);

    // Finish the job OK
    done();
  } catch (error) {
    done(error);
  }
});
// TODO: CREATE APP STAKE FREE TIER, USE EMAIL SERVICE FREE TIER
// APP_STAKE_QUEUE
APP_STAKE_QUEUE.process(async (job, done) => {
  try {
    // Parse the transaction data
    const applicationStakePocketTransaction = job.data;

    // Get the transaction hash to verify
    const hash = applicationStakePocketTransaction.hash;

    // Try to get the transaction from the network
    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

    if (typeGuard(transactionOrError, RpcError)) {
      done(new Error(transactionOrError.message));
      return;
    }

    // Submit App Stake Email
    const postAction = applicationStakePocketTransaction.postAction;

    if (!postAction || postAction.type !== POST_ACTION_TYPE.stakeApplication) {
      done(new Error("Invalid Post Action Type: " + JSON.stringify(postAction)));
      return;
    }

    const {
      address,
      contactEmail,
      emailData,
      paymentEmailData
    } = postAction.data;

    await EmailService
      .to(contactEmail)
      .sendStakeAppEmail(contactEmail, emailData, paymentEmailData);

    if(address !== null && address !== undefined) {
      APPLICATION_SERVICE.changeUpdatingStatus(address, false);
    }

    // Finish the job OK
    done();
  } catch (e) {
    done(e);
  }
});

// APP_UNSTAKE_QUEUE
APP_UNSTAKE_QUEUE.process(async (job, done) => {
  try {
    // Parse the transaction from the job
    const appUnstakePocketTransaction = job.data;

    // Get the transaction hash to verify
    const hash = appUnstakePocketTransaction.hash;

    // Try to get the transaction from the network
    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

    if (typeGuard(transactionOrError, RpcError)) {
      done(new Error(transactionOrError.message));
      return;
    }

    // Submit App Stake Email
    const postAction = appUnstakePocketTransaction.postAction;

    if (!postAction || postAction.type !== POST_ACTION_TYPE.unstakeApplication) {
      done(new Error("Invalid Post Action Type: " + JSON.stringify(postAction)));
      return;
    }

    const {contactEmail, userName, applicationData, address} = postAction.data;

    await EmailService
      .to(contactEmail)
      .sendUnstakeAppEmail(userName, applicationData);

    if (address !== null && address !== undefined) {
      APPLICATION_SERVICE.changeUpdatingStatus(address, false);
    }

    // Finish the job OK
    done();
  } catch (error) {
    done(error);
  }
});

POST_TRANSFER_QUEUE.process(async (job, done) => {

  try {
    // Get the transaction
    const pocketTransaction = job.data;

    // Get the transaction hash to verify
    const hash = pocketTransaction.hash;

    // Try to get the transaction from the network
    const transactionOrError = await POCKET_SERVICE.getTransaction(hash);

    if (typeGuard(transactionOrError, RpcError)) {
      done(new Error(transactionOrError.message));
      return;
    }

    // Type cast after error checking
    const transaction = transactionOrError;

    // Verify
    if (transaction.hash === hash) {
      // Mark the funding transaction as done
      const markedTransactionSuccess = await TRANSACTION_SERVICE.markTransactionSuccess(pocketTransaction);

      if (markedTransactionSuccess) {
        // Execute the post action
        if (pocketTransaction.postAction && pocketTransaction.postAction !== {}) {
          const postAction = pocketTransaction.postAction;

          switch (postAction.type) {
            case POST_ACTION_TYPE.stakeApplication: {
              const appStakeTransaction = postAction.data.appStakeTransaction;
              const stakeAppPostActionHash = await POCKET_SERVICE.submitRawTransaction(appStakeTransaction.address, appStakeTransaction.raw_hex_bytes);

              await TRANSACTION_SERVICE.addAppStakeTransaction(stakeAppPostActionHash, postAction.data);
              break;
            }
            case POST_ACTION_TYPE.stakeNode: {
              const nodeStakeTransaction = postAction.data.nodeStakeTransaction;
              const stakeNodePostActionHash = await POCKET_SERVICE.submitRawTransaction(nodeStakeTransaction.address, nodeStakeTransaction.raw_hex_bytes);

              await TRANSACTION_SERVICE.addNodeStakeTransaction(stakeNodePostActionHash, postAction.data);
              break;
            }
            default:
              done(new Error(`Invalid Post Action: ${JSON.stringify(postAction)}`));
              break;
          }
        }
        done();
      } else {
        done(new Error("Failed to mark transaction as success/completed."));
      }
    }
  } catch (e) {
    done(e);
  }
});
