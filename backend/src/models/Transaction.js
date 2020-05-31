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
      pokt,
      chains
    };

    return new TransactionPostAction(POST_ACTION_TYPE.stakeApplication, data);
  }

  static createStakeNodePostAction(privateKey, passphrase, pokt, chains, serviceURL) {
    const data = {
      account: {
        privateKey,
        passphrase
      },
      pokt,
      chains,
      serviceURL
    };

    return new TransactionPostAction(POST_ACTION_TYPE.stakeNode, data);
  }
}

export class PocketTransaction {

  constructor(createdDate, hash, postAction = {}, completed = false) {
    Object.assign(this, {createdDate, hash, postAction, completed});
  }
}
