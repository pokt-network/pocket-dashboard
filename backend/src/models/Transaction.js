export const POST_ACTION_TYPE = {
  stakeApplication: "STAKE_APPLICATION",
  stakeNode: "STAKE_NODE",
  unstakeApplication: "UNSTAKE_APPLICATION",
  unstakeNode: "UNSTAKE_NODE"
};

export class TransactionPostAction {

  /**
   * @param {string} type Type of post action.
   * @param {*} data Data used in the post action.
   */
  constructor(type, data) {
    Object.assign(this, {type, data});
  }

  /**
   * Create stake application post action.
   *
   * @param {string} privateKey Private key.
   * @param {string} passphrase Passphrase
   * @param {string} pokt POKT to stake.
   * @param {string[]} chains Chains to stake.
   *
   * @returns {TransactionPostAction} Stake post action.
   */
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

  /**
   * Create stake node post action.
   *
   * @param {string} privateKey Private key.
   * @param {string} passphrase Passphrase
   * @param {string} pokt POKT to stake.
   * @param {string[]} chains Chains to stake.
   * @param {string} serviceURL Service URL.
   *
   * @returns {TransactionPostAction} Stake post action.
   */
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

  /**
   * @param {string} createdDate Created date.
   * @param {string} hash Transaction hash.
   * @param {TransactionPostAction} postAction Post action.
   * @param {boolean} completed Completed.
   */
  constructor(createdDate, hash, postAction = {}, completed = false) {
    Object.assign(this, {createdDate, hash, postAction, completed});
  }
}
