export const POST_ACTION_TYPE = {
  stakeApplication: "STAKE_APPLICATION",
  stakeNode: "STAKE_NODE",
  unstakeApplication: "UNSTAKE_APPLICATION",
  unstakeNode: "UNSTAKE_NODE"
};

export class TransactionPostAction {

  constructor(type, data) {
    Object.assign(this, {type, data});
  }

  static createStakeApplicationPostAction(privateKey, passphrase, pokt, chains) {
    const data = {
      account: {
        privateKey,
        passphrase
      },
      pokt: pokt,
      chains: chains
    };

    return new TransactionPostAction(POST_ACTION_TYPE.stakeApplication, data);
  }
}

export class PocketTransaction {

  constructor(createdDate, hash, postAction = {}, completed = false) {
    Object.assign(this, {createdDate, hash, postAction, completed});
  }
}
