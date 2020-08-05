export const SECURITY_QUESTIONS = [
  "What was your childhood nickname?",
  "In what city did you meet your spouse/significant other?",
  "What is the name of your favorite childhood friend?",
  "What street did you live on in third grade?",
  "What is the middle name of your youngest child?",
  "What is your oldest sibling's middle name?",
  "What school did you attend for sixth grade?",
  "What is your oldest cousin's first and last name?",
  "What was the name of your first stuffed animal?",
  "In what city or town did your mother and father meet?",
  "Where were you when you had your first kiss?",
  "What is the first name of the boy or girl that you first kissed?",
  "What was the last name of your third grade teacher?",
  "In what city does your nearest sibling live?",
  "What is your maternal grandmother's maiden name?",
  "In what city or town was your first job?",
  "What is the name of the place your wedding reception was held?"
];

export class SecurityQuestion {

  /**
   * @param {string} question Question data.
   */
  constructor(question) {
    Object.assign(this, {question});
  }

  /**
   * Factory type to create security questions.
   *
   * @param {Array<{question:string}>} questions List of questions.
   *
   * @returns {Array<SecurityQuestion>} A list of security questions.
   * @static
   */
  static createSecurityQuestions(questions) {
    return questions.map(data => new SecurityQuestion(data.question));
  }

}
