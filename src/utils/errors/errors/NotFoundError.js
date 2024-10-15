const ERROR_TYPES = require('./errorTypes');
const BaseError = require('./BaseError');

/**
 * NotFoundError - used when requested data not found.
 */
class NotFoundError extends BaseError {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = ERROR_TYPES.NOT_FOUND;
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
