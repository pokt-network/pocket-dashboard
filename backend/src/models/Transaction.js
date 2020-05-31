export class TransactionPostAction {

  constructor(type, data) {
    Object.assign(this, {type, data});
  }

  static createStakeApplicationPostAction(account, pokt, chains) {
    const data = {
      account: {
        address: account.addressHex,
        publicKey: account.publicKey.toString("hex")
      },
      pokt: pokt,
      chains: chains
    };

    return new TransactionPostAction("STAKE_APPLICATION", data);
  };
}

export class PocketTransaction {

  constructor(createdDate, hash, postAction = {}, completed = false) {
    Object.assign(this, {createdDate, hash, postAction, completed});
  }

  /**
   * Check if transactions is completed.
   *
   * @returns {boolean} If is completed or not.
   */
  isCompleted() {
    return this.completed;
  }
}
