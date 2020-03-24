import PocketBaseService from "./PocketBaseService";
import axios from "axios";

class PocketSecurityQuestionsService extends PocketBaseService {

  constructor() {
    super("api/security_questions");
  }

  /**
   * Get security questions.
   *
   * @return {Promise|Promise<Array.<{string}>>}
   */
  getSecurityQuestions() {
    return axios.get(this._getURL())
      .then(response => response.data);
  }

  /**
   * Save answers of security questions.
   *
   * @param {string} email Email of user.
   * @param {Array<{question:string, answer:string}>} questions Security questions with their answers.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   */
  async saveSecurityQuestionAnswers(email, questions) {
    const data = {
      email,
      questions
    };

    return axios.post(this._getURL("answered"), data)
      .then(response => {
        if (response.status === 200) {

          return {success: response.data};
        }

        return {success: false};
      }).catch(err => {
        return {success: false, data: err.response};
      });
  }

}

export default new PocketSecurityQuestionsService();
