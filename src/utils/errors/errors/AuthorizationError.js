const ERROR_TYPES = require('./errorTypes');
const BaseError = require('./BaseError');

/**
 * AuthorizationError - used when the user has no permission
 * to access data (even successfully authenticated.)
 */
class AuthorizationError extends BaseError {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = ERROR_TYPES.UNAUTHORIZED;
  }
}

module.exports = AuthorizationError;
