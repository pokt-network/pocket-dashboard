import {PocketUser} from "./User";

export class AnsweredSecurityQuestion {

  /**
   * @param {string} question Question data.
   * @param {string} answer Answer data.
   */
  constructor(question, answer) {
    Object.assign(this, {question, answer});
  }

  /**
   * Factory type to create answered security questions.
   *
   * @param {Array<{question:string, answer:string}>} questions List of questions.
   *
   * @returns {Array<AnsweredSecurityQuestion>} A list of security questions answered.
   * @static
   */
  static createAnsweredSecurityQuestions(questions) {
    return questions.map(data => new AnsweredSecurityQuestion(data.question, data.answer));
  }

  /**
   * Factory type to create answered security questions.
   *
   * @param {Array<{question:string, answer:string}>} userDB User information with the list of questions.
   * @param {Array<{question:string, answer:string}>} userInput List of questions with the user answers.
   *
   * @returns {boolean} True or false if the user input answers match database record, reset token generated.
   * @static
   */
  static async validateAnsweredSecurityQuestions(userDB, userInput) {
    const answeredQuestions = userDB.securityQuestions.map(data => new AnsweredSecurityQuestion(data.question, data.answer));

    for (let i = 0; i < answeredQuestions.length; i++) {

      if (answeredQuestions[i].question === userInput[i].question) {

        if (answeredQuestions[i].answer !== userInput[i].answer) {
          return false;
        }
      } else {
        return false;
      }
    }

    return true;
  }

}
