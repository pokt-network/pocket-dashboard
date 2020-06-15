import JobService from "bull";
import {Configurations} from "../../_configuration";

export default class JobsProvider {

  /**
   * Get job queue.
   *
   * @param {string} jobName Job name.
   *
   * @returns {*} Job queue.
   * @private
   * @static
   */
  static __getJobQueue(jobName) {
    const {
      jobs: {
        database_url: databaseURL
      }
    } = Configurations.pocket_network;

    return new JobService(jobName, databaseURL);
  }

  /**
   * Get post transfer job queue.
   *
   * @returns {*} Post transfer job queue.
   * @static
   */
  static getPostTransferJobQueue() {
    return this.__getJobQueue("POST_TRANSFER_QUEUE");
  }

  /**
   * Get stake job queue.
   *
   * @returns {*} Stake job queue.
   * @static
   */
  static getAppStakeJobQueue() {
    return this.__getJobQueue("APP_STAKE_QUEUE");
  }

  // /**
  //  * Get unstake job queue.
  //  *
  //  * @returns {*} Unstake job queue.
  //  * @static
  //  */
  // static getUnStakeJobQueue() {
  //   return this.__getJobQueue("UNSTAKE_QUEUE");
  // }

  // /**
  //  * Get unstake job queue.
  //  *
  //  * @returns {*} UnJail job queue.
  //  * @static
  //  */
  // static getUnJailJobQueue() {
  //   return this.__getJobQueue("UNJAIL_QUEUE");
  // }

  /**
   * Add a job to a queue.
   *
   * @param {*} jobQueue Queue to add the job.
   * @param {*} data Data to add.
   */
  static addJob(jobQueue, data) {
    const {
      jobs: {
        delayed_time: delayedTime,
        attempts
      }
    } = Configurations.pocket_network;

    const delayedTimeNumber = parseInt(delayedTime.toString());
    const attemptsNumber = parseInt(attempts.toString());

    const jobConfiguration = {delay: delayedTimeNumber, attempts: attemptsNumber, backoff: delayedTimeNumber};

    jobQueue.add(data, jobConfiguration);
  }

}
