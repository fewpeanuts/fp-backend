const ERROR_TYPES = require('./errorTypes');
const BaseError = require('./BaseError');

/**
 * AuthenticationError - used when the user's security check is failed.
 */
class AuthenticationError extends BaseError {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = ERROR_TYPES.UNAUTHENTICATED;
    this.statusCode = 403;
  }
}

module.exports = AuthenticationError;
