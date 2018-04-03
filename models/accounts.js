const Customers = require('./customers');
const errors = require('../lib/errors');

const Account = module.exports = {};

Account.list = function(customer_id, knex) {
  return knex
  .select('id', 'balance')
  .from('accounts')
  .where({customer_id});
};

Account.create = function(customer_id, balance, knex) {
  return knex('accounts')
  .insert({customer_id, balance})
  .returning('id')
  .then((row) => {
    return row[0];
  });
};

Account.get = function(account_id, knex) {
  return knex('accounts')
  .select('id', 'balance')
  .where({id: account_id})
  .then((rows) => {
    if (!rows.length) {
      throw new errors.NotFound('Account not found', {account_id})
    } else {
      return rows[0];
    }
  });
};
