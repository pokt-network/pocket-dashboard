import {SendGridEmailProvider} from "../providers/data/SendGridEmailProvider";
import {Configurations} from "../_configuration";

export default class EmailService {

  /**
   * @param {string} toEmail Recipient of email.
   */
  constructor(toEmail) {
    this.emailProvider = new SendGridEmailProvider(Configurations.email.api_key);
    this.__toEmail = toEmail;
  }

  /**
   * Email to recipient.
   *
   * @param {string} toEmail Recipient of email.
   *
   * @returns {EmailService} Email service.
   */
  static to(toEmail) {
    return new EmailService(toEmail);
  }

  /**
   * Send email through email provider.
   *
   * @param {string} templateID Template ID
   * @param {object} templateData Template data.
   *
   * @returns {Promise<boolean>} Email response.
   * @async
   * @private
   */
  async __sendEmail(templateID, templateData) {
    const fromEmail = Configurations.email.from_email;

    /** @type {{statusCode: number}[]} */
    const emailResponse = await this.emailProvider.sendEmailWithTemplate(templateID, this.__toEmail, fromEmail, templateData);

    return emailResponse[0].statusCode === 202;
  }

  /**
   * Send test email.
   *
   * @param {string} templateID Template test ID.
   *
   * @returns {Promise<boolean>} Email response.
   * @async
   */
  async sendTestEmail(templateID) {
    return this.__sendEmail(templateID, {TEST: "Yes"});
  }

}
