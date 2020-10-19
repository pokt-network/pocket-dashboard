export class DashboardError extends Error {

  /**
   * @param {string} message Message.
   */
  constructor(message) {
    super(message);
    this.name = "DashboardError";
    Error.captureStackTrace(this, DashboardError);
  }
}

export class DashboardValidationError extends DashboardError {

  /**
   * @param {string} message Message.
   */
  constructor(message) {
    super(message);
    this.name = "DashboardValidationError";
    Error.captureStackTrace(this, DashboardValidationError);
  }
}

export class PocketNetworkError extends Error {

  /**
   * @param {string} message Message.
   */
  constructor(message) {
    super(message);
    this.name = "PocketNetworkError";
    this.error = "PocketNetworkError";
    Error.captureStackTrace(this, PocketNetworkError);
  }
}
