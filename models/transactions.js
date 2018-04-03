const Promise = require('bluebird');
const errors = require('../lib/errors');

const Transactions = module.exports = {};

Transactions.list = function(account_id, knex) {
  return knex
  .select('id', 'amount', 'from_account_id', 'to_account_id', 'created_at')
  .from('transactions')
  .where({from_account_id: account_id})
  .orWhere({to_account_id: account_id});
};

Transactions.create = function(from_account_id, to_account_id, amount, knex) {
  if (from_account_id === to_account_id) {
    return Promise.reject(new errors.IllegalTransaction('Trying to change same account'));
  }

  return knex.transaction((trx) => {
    return trx('accounts')
    .select('id', 'balance')
    .whereIn('id', [from_account_id, to_account_id])
    .forUpdate()
    .then((rows) => {
      const from_account = rows.find((r) => r.id === from_account_id);
      if (!from_account) {
        throw new errors.NotFound('Account not found', {from_account_id});
      }

      const to_account = rows.find((r) => r.id === to_account_id);
      if (!to_account) {
        throw new errors.NotFound('Account not found', {to_account_id});
      }

      return from_account;
    })
    .then((from_account) => {
      if (from_account.balance < amount) {
        throw new errors.IllegalTransaction('Insufficient balance', {account_id: from_account_id});
      }

      const queries = [
        trx('transactions').insert({from_account_id, to_account_id, amount, to_account_id}).returning('id'),
        trx('accounts').where({id: from_account_id}).decrement('balance', amount),
        trx('accounts').where({id: to_account_id}).increment('balance', amount)
      ];

      return Promise.all(queries).then((results) => {
        const transaction_id = results[0][0];
        return transaction_id;
      });
    });
  });
};
