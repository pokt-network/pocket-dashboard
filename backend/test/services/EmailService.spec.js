import {Configurations} from "../../src/_configuration";
import {describe, it} from "mocha";
import "chai/register-should";
import EmailService from "../../src/services/EmailService";

const TO_EMAIL_ADDRESS = process.env.TEST_TO_EMAIL_ADDRESS;

describe("EmailService", () => {

  if (TO_EMAIL_ADDRESS && Configurations.email.test_template_id) {
    describe("sendTestEmail", () => {
      it("Expect email response with success", async () => {

        const emailResponse = await EmailService.to(TO_EMAIL_ADDRESS).sendTestEmail();

        console.log(emailResponse);

        // // eslint-disable-next-line no-undef
        // should.exist(applicationResult);
        // // eslint-disable-next-line no-undef
        // should.exist(applicationResult.privateApplicationData.address);
        // // eslint-disable-next-line no-undef
        // should.exist(applicationResult.privateApplicationData.privateKey);

        // applicationResult.privateApplicationData.address.length.should.be.equal(40);
        // applicationResult.privateApplicationData.privateKey.length.should.be.equal(128);
        //
        // applicationResult.networkData.stakedTokens.toString().should.be.equal("0");
        // applicationResult.networkData.jailed.should.be.equal(false);
        // applicationResult.networkData.status.should.be.equal(StakingStatus.Unstaked);
      });
    });
  }
});
