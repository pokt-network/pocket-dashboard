import {describe, it} from "mocha";
import "chai/register-should";
import {PrivatePocketAccount, PublicPocketAccount} from "../../src/models/Account";
import PocketService from "../../src/services/PocketService";
import {Configurations} from "../../src/_configuration";

const POCKET_NETWORK_CONFIGURATION = Configurations.pocket_network;

const pocketService = new PocketService(POCKET_NETWORK_CONFIGURATION.nodes.test, POCKET_NETWORK_CONFIGURATION.nodes.test_rpc_provider);

describe("Account model", () => {

  describe("PublicPocketAccount.createPublicPocketAccount", () => {
    it("Expect a success public pocket account information", async () => {

      const testPassPhrase = "12345678";
      const applicationAccount = await pocketService.createAccount(testPassPhrase);

      const publicPocketAccount = PublicPocketAccount.createPublicPocketAccount(applicationAccount);

      // eslint-disable-next-line no-undef
      should.exist(publicPocketAccount);
      publicPocketAccount.should.be.an("object");
      publicPocketAccount.address.length.should.be.equal(40);
    });
  });

  describe("PrivatePocketAccount.createPrivatePocketAccount", () => {
    it("Expect a success private pocket account information", async () => {

      const testPassPhrase = "12345678";
      const applicationAccount = await pocketService.createAccount(testPassPhrase);

      const privatePocketAccount = await PrivatePocketAccount.createPrivatePocketAccount(pocketService, applicationAccount, testPassPhrase);

      // eslint-disable-next-line no-undef
      should.exist(privatePocketAccount);
      privatePocketAccount.should.be.an("object");
    });
  });

});
