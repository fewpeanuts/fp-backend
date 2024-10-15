class BaseError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
  }

  // field is named message to respect Error, but we decide to name
  // it data to communicate with users of our error classes, so that
  // they use this to understand the context of the error, not to
  // display to the end user.
  getData() {
    return this.message;
  }

  getType() {
    return this.type;
  }
}

module.exports = BaseError;
