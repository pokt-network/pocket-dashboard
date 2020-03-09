import {after, before, describe, it} from "mocha";
import "chai/register-should";
import PoktService from "../../src/services/PoktService";
import {configurations} from "../../src/_configuration";

let poktService = null;

before(() => {
  poktService = new PoktService(configurations.poktNetwork.nodes.test);
});


after(() => {
  poktService = null;
});

describe('PoktService', () => {

  describe('createAccount', () => {
    it('Expect an application account successfully created', async () => {
      const testPassPhrase = "12345678";
      const applicationAccount = await poktService.createAccount(testPassPhrase);

      should.exist(applicationAccount);
      applicationAccount.should.be.an('object');
    });
  });

  describe('getAccount', () => {
    it('Expect an application account successfully created', async () => {
      const testPassPhrase = "12345678";
      const account = await poktService.createAccount(testPassPhrase);

      const retrievedAccount = await poktService.getAccount(account.addressHex);

      should.exist(account);
      should.exist(retrievedAccount);
      account.addressHex.should.be.equal(retrievedAccount.addressHex);
    });
  });

  describe('importAccount', () => {
    it('Expect an application account successfully imported', async () => {
      const testPassPhrase = "12345678";
      const account = await poktService.createAccount(testPassPhrase);
      const accountPrivateKeyHex = await poktService.exportRawAccount(account.addressHex, testPassPhrase);

      const importedAccount = await poktService.importAccount(accountPrivateKeyHex, testPassPhrase);

      should.exist(importedAccount);
      importedAccount.should.be.an('object');
      account.addressHex.should.be.equal(importedAccount.addressHex);
    });
  });

  describe('exportAccount', () => {
    it('Expect an application account successfully exported', async () => {
      const testPassPhrase = "12345678";
      const account = await poktService.createAccount(testPassPhrase);

      const privateKey = await poktService.exportAccount(account.addressHex, testPassPhrase);

      should.exist(privateKey);
      privateKey.length.should.equal(64);
    });
  });

  describe('exportRawAccount', () => {
    it('Expect an application account successfully exported', async () => {
      const testPassPhrase = "12345678";
      const account = await poktService.createAccount(testPassPhrase);

      const privateKeyHex = await poktService.exportRawAccount(account.addressHex, testPassPhrase);

      should.exist(privateKeyHex);
      privateKeyHex.should.be.an('string');
    });
  });

  describe('createApplicationAuthenticationToken', () => {
    it('Expected an ATT successfully created', async () => {
      const testPassPhrase = "12345678";
      const clientAccount = await poktService.createAccount(testPassPhrase);
      const applicationAccount = await poktService.createAccount(testPassPhrase);

      const attToken = await poktService.createApplicationAuthenticationToken(clientAccount, applicationAccount, testPassPhrase);

      should.exist(attToken);
      attToken.should.be.an('object');
    });
  });

});
