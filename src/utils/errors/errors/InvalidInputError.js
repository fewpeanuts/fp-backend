const ERROR_TYPES = require('./errorTypes');
const BaseError = require('./BaseError');

/**
 * InvalidInputError - used when the input format is invalid, or unrecognizible input.
 */
class InvalidInputError extends BaseError {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = ERROR_TYPES.INVALID_INPUT_DATA;
    this.statusCode = 400;
  }
}

module.exports = InvalidInputError;
