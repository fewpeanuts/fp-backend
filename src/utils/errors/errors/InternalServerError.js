const ERROR_TYPES = require('./errorTypes');
const BaseError = require('./BaseError');

/**
 * InternalServerError - used for generic server error. Should avoid
 * using this unless there is no other Error appropriate.
 */
class InternalServerError extends BaseError {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = ERROR_TYPES.INTERNAL_SERVER_ERROR;
  }
}

module.exports = InternalServerError;
