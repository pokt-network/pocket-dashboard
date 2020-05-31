import JobService from "bull";
import TransactionService from "./services/TransactionService";
import PocketService, {get_default_pocket_network} from "./services/PocketService";
import {POST_ACTION_TYPE} from "./models/Transaction";
import AccountService from "./services/AccountService";

const POCKET_DATA = get_default_pocket_network();

const TRANSACTION_SERVICE = new TransactionService();
const ACCOUNT_SERVICE = new AccountService();
const POCKET_SERVICE = new PocketService(POCKET_DATA.nodes, POCKET_DATA.rpcProvider);

const TRANSFER_QUEUE = new JobService("TRANSFER_QUEUE");
const STAKE_QUEUE = new JobService("STAKE_QUEUE");
const UNSTAKE_QUEUE = new JobService("UNSTAKE_QUEUE");

TRANSFER_QUEUE.on("completed", (job, result) => {
  console.log(`Job completed with result ${result}`);
});


STAKE_QUEUE.process(async (job, done) => {
  const {
    data: {
      hash: transactionHash
    }
  } = job;

  try {
    const transaction = await POCKET_SERVICE.getTransaction(transactionHash);

    if (transaction.hash === transactionHash) {
      console.log("stake");
      console.log("transaction");
      console.log(transaction);
      done(transactionHash);
    }
  } catch (e) {
    done(new Error(e.message));
  }
});


TRANSFER_QUEUE.process(async (job, done) => {
  const {
    data: {
      hash: transactionHash,
      postAction: {
        type: postActionType,
        data: {
          account,
          pokt,
          chains
        }
      }
    }
  } = job;

  try {
    const transaction = await POCKET_SERVICE.getTransaction(transactionHash);

    if (transaction.hash === transactionHash) {
      const applicationAccount = await ACCOUNT_SERVICE
        .importAccountToNetwork(POCKET_SERVICE, account.privateKey, account.passphrase);

      switch (postActionType) {
        case POST_ACTION_TYPE.stakeApplication: {
          const stakeTransaction = await POCKET_SERVICE
            .stakeApplication(applicationAccount, account.passphrase, pokt, chains);

          await TRANSACTION_SERVICE.addStakeTransaction(stakeTransaction.hash);
          break;
        }
      }
      done(transactionHash);
    }
  } catch (e) {
    done(new Error(e.message));
  }
});
