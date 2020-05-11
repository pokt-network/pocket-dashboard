import mail from "@sendgrid/mail";

/**
 * For more information go to: https://github.com/sendgrid/sendgrid-nodejs
 */
export class SendGridEmailProvider {
  /**
   * @param {string} apiKey API Key from SendGrid.
   */
  constructor(apiKey) {
    mail.setApiKey(apiKey);
  }

  /**
   * Send email using a template.
   *
   * @param {string} templateID Template ID used __toEmail send email.
   * @param {string} toEmail Recipient __toEmail send email.
   * @param {string} fromEmail From where send email.
   * @param {object} templateData Template data.
   *
   * @returns {Promise<*>} Email response.
   * @async
   */
  async sendEmailWithTemplate(templateID, toEmail, fromEmail, templateData) {
    const message = {
      to: toEmail, from: fromEmail, templateId: templateID, dynamic_template_data: templateData
    };

    return mail.send(message);
  }
}
