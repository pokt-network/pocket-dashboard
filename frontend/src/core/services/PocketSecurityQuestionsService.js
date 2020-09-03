import PocketBaseService from "./PocketBaseService";
import axiosInstance from "./_serviceHelper";
const axios = axiosInstance();

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

  /**
   * Get user random security question.
   *
   * @param {string} email Email of user.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   */
  async getUserRandomSecurityQuestion(email) {
    const data = {
      email
    };

    return axios.post(this._getURL("user/random"), data)
      .then(response => {
        if (response.status === 200) {
          return {success: response.data};
        }
        return {success: false};
      }).catch(err => {
        return {success: false, data: err.response};
      });
  }

  /**
   * Get all the user security questions.
   *
   * @param {string} email Email of user.
   *
   * @return {Promise|Promise<{success:boolean, [data]: *}>}
   */
  async getUserSecurityQuestions(email) {
    const data = {
      email
    };

    return axios.post(this._getURL("user/all"), data)
      .then(response => {
        if (response.status === 200) {
          return {success: true, data: response.data};
        }
        return {success: false};
      }).catch(err => {
        return {success: false, data: err.response};
      });
  }

  /**
   * Validate all the user security questions.
   *
   * @param {string} email Email of user.
   * @param {[question: string, answer: string]} answeredQuestions User input answers.
   *
   * @return {Promise|Promise<{success:boolean}>}
   */
  async validateUserSecurityQuestions(email, answeredQuestions) {
    const data = {
      email,
      answeredQuestions
    };

    return axios.post(this._getURL("user/validate-answers"), data)
      .then(response => {
        if (response.status === 200) {
          return {success: true, data: response.data};
        }
        return {success: false};
      }).catch(err => {
        return {success: false, data: err.response};
      });
  }

}



export default new PocketSecurityQuestionsService();
