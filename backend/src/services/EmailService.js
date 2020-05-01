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
   * @returns {Promise<*>} Email response.
   * @async
   * @private
   */
  async __sendEmail(templateID, templateData) {
    const fromEmail = Configurations.email.from_email;

    return this.emailProvider.sendEmailWithTemplate(templateID, this.__toEmail, fromEmail, templateData);
  }

  /**
   * Send test email.
   *
   * @returns {Promise<*>} Email response.
   * @async
   */
  async sendTestEmail() {
    const testEmailTemplateID = Configurations.email.test_template_id;

    return this.__sendEmail(testEmailTemplateID, {});
  }

}
