const ERROR_TYPES = Object.freeze({
  NOT_FOUND: 'not found',


  INVALID_INPUT_DATA: 'input data is invalid',
  NETWORK_ERROR: 'notwork error',
  UNAUTHENTICATED: 'unauthenticated error',
  UNAUTHORIZED: 'unauthorized error',
  INTERNAL_SERVER_ERROR: 'internal server error',
  MISSING_OR_INVALID_HTTP_HEADER: 'http header error',

  PAGE_NUMBER_LESS_THAN_ONE: 'page number less than one',
  PAGE_SIZE_LESS_THAN_ONE: 'page size less than one',

  REQUEST_DATA_NOT_FOUND: 'data not found',
  VALIDATION_FAILURE: 'validation fail error',
});

module.exports = ERROR_TYPES;
