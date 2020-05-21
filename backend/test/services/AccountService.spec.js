import {before, describe, it} from "mocha";
import {assert} from "chai";
import {configureTestService} from "../setupTests";
import AccountService from "../../src/services/AccountService";

/** @type {string} */
const ACCOUNT_PRIVATE_KEY_ON_NETWORK = process.env.TEST_ACCOUNT_PRIVATE_KEY_ON_NETWORK;
const ACCOUNT_PRIVATE_KEY_ON_NETWORK_PASSPHRASE = process.env.TEST_ACCOUNT_PRIVATE_KEY_ON_NETWORK_PASSPHRASE;

const accountService = new AccountService();

before(() => {
  configureTestService(accountService);
});

describe("AccountService", () => {

  if (ACCOUNT_PRIVATE_KEY_ON_NETWORK && ACCOUNT_PRIVATE_KEY_ON_NETWORK_PASSPHRASE) {
    describe("importAccountFromNetwork", () => {
      it("Expect an account successfully imported", async () => {

        const publicAccount = await accountService
          .importDashboardAccountToNetwork(ACCOUNT_PRIVATE_KEY_ON_NETWORK, ACCOUNT_PRIVATE_KEY_ON_NETWORK_PASSPHRASE);

        assert.isDefined(publicAccount);

        assert.isNotEmpty(publicAccount.address);
        assert.isNotEmpty(publicAccount.publicKey);
        assert.equal(publicAccount.address.length, 40);
      });
    });
  }
});
