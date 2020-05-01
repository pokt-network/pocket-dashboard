import {SendGridEmailProvider} from "../providers/data/SendGridEmailProvider";
import {Configurations} from "../_configuration";

export class EmailService {

  constructor() {
    this.emailProvider = new SendGridEmailProvider(Configurations.email.api_key);
  }

  /**
   * Send email through email provider.
   *
   * @param {string} templateID Template ID
   * @param {string} toEmail Recipient of email.
   * @param {object} templateData Template data.
   *
   * @returns {Promise<*>} Email response.
   * @async
   * @private
   */
  async __sendEmail(templateID, toEmail, templateData) {
    const fromEmail = Configurations.email.from_email;

    return this.emailProvider.sendEmailWithTemplate(templateID, toEmail, fromEmail, templateData);
  }

}
