// TODO: Move this logic to the frontend.
import TransactionService from "./services/TransactionService";
import PocketService from "./services/PocketService";
import JobsProvider from "./providers/data/JobsProvider";
import { typeGuard, RpcError } from "@pokt-network/pocket-js";
import EmailService from "./services/EmailService";
import { POST_ACTION_TYPE } from "./models/Transaction";

const TRANSACTION_SERVICE = new TransactionService();
const POCKET_SERVICE = new PocketService();

const POST_TRANSFER_QUEUE = JobsProvider.getPostTransferJobQueue();
const APP_STAKE_QUEUE = JobsProvider.getAppStakeJobQueue();

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
      done(new Error("Invalid Post Action Type: " + JSON.stringify(postAction)))
      return;
    }

    const {
      contactEmail,
      emailData,
      paymentEmailData
    } = postAction.data;
    const emailService = new EmailService(contactEmail);
    await emailService.sendStakeAppEmail(contactEmail, emailData, paymentEmailData);

    // Finish the job OK
    done();
  } catch(e) {
    console.error(e);
    done(e);
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
      return
    }

    // Type cast after error checking
    const transaction = transactionOrError;

    // Verify
    if (transaction.hash === hash) {
      // Mark the funding transaction as done
      await TRANSACTION_SERVICE.markTransactionSuccess(pocketTransaction);

      // Execute the post action
      if (pocketTransaction.postAction && pocketTransaction.postAction !== {}) {
        const postAction = pocketTransaction.postAction;
        switch (postAction.type) {
          case POST_ACTION_TYPE.stakeApplication:
            const appStakeTransaction = postAction.data.appStakeTransaction;
            const postActionTxHash = await POCKET_SERVICE.submitRawTransaction(appStakeTransaction.address, appStakeTransaction.raw_hex_bytes);
            await TRANSACTION_SERVICE.addAppStakeTransaction(postActionTxHash, postAction.data);
            break;
          default:
            done(new Error(`Invalid Post Action: ${JSON.stringify(postAction)}`));
            break;
        }
      }
      done();
    }
  } catch (e) {
    console.error(e);
    done(e);
  }
});
