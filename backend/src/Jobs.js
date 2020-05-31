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


STAKE_QUEUE.process(async (job, done) => {
  const {
    data: pocketTransaction
  } = job;

  try {
    const transaction = await POCKET_SERVICE.getTransaction(pocketTransaction.hash);

    if (transaction.hash === pocketTransaction.hash) {
      await TRANSACTION_SERVICE.markTransactionSuccess(pocketTransaction);

      done("OK");
    }
  } catch (e) {
    done(new Error(e.message));
  }
});

UNSTAKE_QUEUE.process(async (job, done) => {
  const {
    data: pocketTransaction
  } = job;

  try {
    const transaction = await POCKET_SERVICE.getTransaction(pocketTransaction.hash);

    if (transaction.hash === pocketTransaction.hash) {
      await TRANSACTION_SERVICE.markTransactionSuccess(pocketTransaction);

      done("OK");
    }
  } catch (e) {
    done(new Error(e.message));
  }
});


TRANSFER_QUEUE.process(async (job, done) => {
  const {
    data: pocketTransaction
  } = job;

  const {
    hash: transactionHash,
    postAction: {
      type: postActionType,
      data: stakeData
    }
  } = pocketTransaction;

  try {
    const transaction = await POCKET_SERVICE.getTransaction(transactionHash);

    if (transaction.hash === transactionHash) {
      const {account, pokt, chains} = stakeData;

      const applicationAccount = await ACCOUNT_SERVICE
        .importAccountToNetwork(POCKET_SERVICE, account.privateKey, account.passphrase);

      switch (postActionType) {
        case POST_ACTION_TYPE.stakeApplication: {
          const stakeTransaction = await POCKET_SERVICE
            .stakeApplication(applicationAccount, account.passphrase, pokt, chains);

          await TRANSACTION_SERVICE.addStakeTransaction(stakeTransaction.hash);
          break;
        }
        case POST_ACTION_TYPE.stakeNode: {
          const serviceURL = new URL(stakeData.serviceURL);

          const stakeTransaction = await POCKET_SERVICE
            .stakeNode(applicationAccount, account.passphrase, pokt, chains, serviceURL);

          await TRANSACTION_SERVICE.addStakeTransaction(stakeTransaction.hash);
          break;
        }
      }

      await TRANSACTION_SERVICE.markTransactionSuccess(pocketTransaction);

      done("OK");
    }
  } catch (e) {
    done(new Error(e.message));
  }
});
