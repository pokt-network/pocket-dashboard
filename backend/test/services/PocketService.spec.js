import {describe, it} from "mocha";
import "chai/register-should";
import PocketService from "../../src/services/PocketService";
import {Configurations} from "../../src/_configuration";

const pocketService = new PocketService(Configurations.pocketNetwork.nodes.test, Configurations.pocketNetwork.nodes.test_rpc_provider);


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
      const applicationAccount = await pocketService.createAccount(testPassPhrase);

      const attToken = await pocketService.getApplicationAuthenticationToken(clientAccount, applicationAccount, testPassPhrase);

      // eslint-disable-next-line no-undef
      should.exist(attToken);

      attToken.should.be.an("object");
    });
  });

  describe.skip("getApplication", () => {
    it("Expected an application information successfully retrieved", async () => {
      const testPassPhrase = "12345678";
      const applicationAccount = await pocketService.createAccount(testPassPhrase);

      const applicationData = await pocketService.getApplication(applicationAccount.addressHex);

      console.log(applicationData);

      // eslint-disable-next-line no-undef
      should.exist(applicationData);

      applicationData.should.be.an("object");
    });
  });

});
