import {describe, it} from "mocha";
import "chai/register-should";
import EmailService from "../../src/services/EmailService";

const TO_EMAIL_ADDRESS = process.env.TEST_TO_EMAIL_ADDRESS;
const TEST_TEMPLATE_ID = process.env.TEST_TEMPLATE_ID;

describe("EmailService", () => {

  if (TO_EMAIL_ADDRESS && TEST_TEMPLATE_ID) {
    describe("sendTestEmail", () => {
      it("Expect a true value", async () => {

        const sent = await EmailService.to(TO_EMAIL_ADDRESS).sendTestEmail(TEST_TEMPLATE_ID);

        sent.should.true;
      });
    });
  }
});
