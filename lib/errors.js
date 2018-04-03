const _ = require('lodash');
const util = require('util');

const errors = {
  NotFound: {
    code: 'not_found',
    status: 404
  },

  IllegalTransaction: {
    code: 'illegal_transaction',
    status: 402
  },

  BadRequest: {
    code: 'bad_request',
    status: 400
  }
}

module.exports = {}

_.each(errors, (opts, errName) => {

  var err = function(message, details) {
    Error.captureStackTrace(this, this.constructor);
    this.code = opts.code;
    this.message = message;
    this.status = opts.status
    this.details = details;
  }

  util.inherits(err, Error);
  module.exports[errName] = err
});

module.exports.parseJsonSchemaValidationError = function(error) {
  return new module.exports.BadRequest('JSON does not match schema', error.validations)
};
