import {before, describe, it} from "mocha";
import "chai/register-should";
import {configureTestService} from "../setupTests";
import AccountService from "../../src/services/AccountService";

/** @type {string} */
const APPLICATION_PRIVATE_KEY_ON_NETWORK = process.env.APPLICATION_PRIVATE_KEY_ON_NETWORK;


const accountService = new AccountService();

before(() => {
  configureTestService(accountService);
});

describe("AccountService", () => {

  if (APPLICATION_PRIVATE_KEY_ON_NETWORK) {
    describe("importAccountFromNetwork", () => {
      it("Expect an account successfully imported", async () => {

        const publicAccount = await accountService.importAccountFromNetwork(APPLICATION_PRIVATE_KEY_ON_NETWORK);

        // eslint-disable-next-line no-undef
        should.exist(publicAccount);
        // eslint-disable-next-line no-undef
        should.exist(publicAccount.address);
        // eslint-disable-next-line no-undef
        should.exist(publicAccount.publicKey);

        publicAccount.address.length.should.be.equal(40);
      });
    });
  }
});
