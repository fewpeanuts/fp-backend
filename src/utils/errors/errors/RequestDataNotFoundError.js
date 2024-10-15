const ERROR_TYPES = require('./errorTypes');
const BaseError = require('./BaseError');

/**
 * NotFoundError - used when requested data not found.
 */
class RequestDataNotFoundError extends BaseError {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = ERROR_TYPES.REQUEST_DATA_NOT_FOUND;
  }
}

module.exports = RequestDataNotFoundError;
