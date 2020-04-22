import {describe, it} from "mocha";
import "chai/register-should";
import PocketService from "../../src/services/PocketService";
import {Configurations} from "../../src/_configuration";
import {StakingStatus} from "@pokt-network/pocket-js";

/** @type {string} */
const ACCOUNT_PRIVATE_KEY_WITH_POKT = process.env.ACCOUNT_PRIVATE_KEY_WITH_POKT;
const POCKET_NETWORK_CONFIGURATION = Configurations.pocket_network;

const pocketService = new PocketService(POCKET_NETWORK_CONFIGURATION.nodes.test, POCKET_NETWORK_CONFIGURATION.nodes.test_rpc_provider);

describe("PocketService", () => {

  describe("createAccount", () => {
    it("Expect an application account successfully created", async () => {
      const testPassPhrase = "12345678";
      const applicationAccount = await pocketService.createAccount(testPassPhrase);

      // eslint-disable-next-line no-undef
      should.exist(applicationAccount);
      applicationAccount.should.be.an("object");
    });
  });

  describe("getAccount", () => {
    it("Expect an application account successfully retrieved", async () => {
      const testPassPhrase = "12345678";
      const account = await pocketService.createAccount(testPassPhrase);

      const retrievedAccount = await pocketService.getAccount(account.addressHex);

      // eslint-disable-next-line no-undef
      should.exist(account);
      // eslint-disable-next-line no-undef
      should.exist(retrievedAccount);

      account.addressHex.should.be.equal(retrievedAccount.addressHex);
    });
  });

  describe("importAccount", () => {
    it("Expect an application account successfully imported", async () => {
      const testPassPhrase = "12345678";
      const account = await pocketService.createAccount(testPassPhrase);
      const accountPrivateKeyHex = await pocketService.exportRawAccount(account.addressHex, testPassPhrase);

      const importedAccount = await pocketService.importAccount(accountPrivateKeyHex, testPassPhrase);

      // eslint-disable-next-line no-undef
      should.exist(importedAccount);

      importedAccount.should.be.an("object");
      account.addressHex.should.be.equal(importedAccount.addressHex);
    });
  });

  describe("exportAccount", () => {
    it("Expect an application account successfully exported", async () => {
      const testPassPhrase = "12345678";
      const account = await pocketService.createAccount(testPassPhrase);

      const privateKey = await pocketService.exportAccount(account.addressHex, testPassPhrase);

      // eslint-disable-next-line no-undef
      should.exist(privateKey);

      privateKey.length.should.equal(64);
    });
  });

  describe("exportRawAccount", () => {
    it("Expect an application account successfully exported", async () => {
      const testPassPhrase = "12345678";
      const account = await pocketService.createAccount(testPassPhrase);

      const privateKeyHex = await pocketService.exportRawAccount(account.addressHex, testPassPhrase);

      // eslint-disable-next-line no-undef
      should.exist(privateKeyHex);

      privateKeyHex.should.be.an("string");
    });
  });

  describe("getApplicationAuthenticationToken", () => {
    it("Expected an ATT successfully retrieved", async () => {
      const testPassPhrase = "12345678";
      const clientAccount = await pocketService.createAccount(testPassPhrase);
      const clientPublicKey = clientAccount.publicKey.toString("hex");
      const applicationAccount = await pocketService.createAccount(testPassPhrase);

      const attToken = await pocketService.getApplicationAuthenticationToken(clientPublicKey, applicationAccount, testPassPhrase);

      // eslint-disable-next-line no-undef
      should.exist(attToken);

      attToken.should.be.an("object");
    });
  });

  describe("getApplications", () => {
    it("Expected applications data successfully retrieved", async () => {
      const applicationsData = await pocketService.getApplications(StakingStatus.Staked);


      // eslint-disable-next-line no-undef
      should.exist(applicationsData);

      applicationsData.should.be.an("array");
      applicationsData.length.should.be.greaterThan(0);
    });
  });
  if (ACCOUNT_PRIVATE_KEY_WITH_POKT) {
    describe("stakeApplication", () => {
      it("Expected a transaction hash successfully", async () => {
        const passPhrase = "testPassphrase";
        const account = await pocketService.importAccount(ACCOUNT_PRIVATE_KEY_WITH_POKT, passPhrase);
        const poktToStake = "10000000";
        const networkChains = [
          "a969144c864bd87a92e974f11aca9d964fb84cf5fb67bcc6583fe91a407a9309"
        ];

        const transaction = await pocketService.stakeApplication(account, passPhrase, poktToStake, networkChains);

        // eslint-disable-next-line no-undef
        should.exist(transaction);

        transaction.should.be.an("object");
        transaction.logs.should.be.an("array");

        transaction.logs.should.not.to.be.empty;
        transaction.logs[0].success.should.to.be.true;
      });
    });

    describe("unstakeApplication", () => {
      it("Expected a transaction hash successfully", async () => {
        const passPhrase = "testPassphrase";
        const account = await pocketService.importAccount(ACCOUNT_PRIVATE_KEY_WITH_POKT, passPhrase);

        const transaction = await pocketService.unstakeApplication(account, passPhrase);

        // eslint-disable-next-line no-undef
        should.exist(transaction);

        transaction.should.be.an("object");
        transaction.logs.should.be.an("array");

        transaction.logs.should.not.to.be.empty;
        transaction.logs[0].success.should.to.be.true;
      });
    });
  }
});
