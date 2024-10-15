const ERROR_TYPES = require('./errorTypes');
const BaseError = require('./BaseError');

/**
 * ValidationError - used when business logic validation failed.
 */
class ValidationError extends BaseError {
  constructor(message) {
    super(message);
    this.message = message;
    this.type = ERROR_TYPES.VALIDATION_FAILURE;
  }
}

module.exports = ValidationError;
