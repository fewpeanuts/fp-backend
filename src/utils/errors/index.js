const ValidationError = require("./errors/ValidationError");
const NotFoundError = require("./errors/NotFoundError");
const InternalServerError = require("./errors/InternalServerError");
const AuthenticationError = require("./errors/AuthenticationError");
const AuthorizationError = require("./errors/AuthorizationError");
const InvalidInputError = require("./errors/InvalidInputError");
const RequestDataNotFoundError = require("./errors/RequestDataNotFoundError");

module.exports = {
  ValidationError,
  RequestDataNotFoundError,
  NotFoundError,
  InternalServerError,
  AuthenticationError,
  AuthorizationError,
  InvalidInputError,
  ERROR_TYPES: require("./errors/errorTypes"),
};
