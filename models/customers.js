const errors = require('../lib/errors');

const Customers = module.exports = {};

Customers.list = function(knex) {
  return knex('customers')
  .select('id', 'name');
}

Customers.get = function(customer_id, knex) {
  return knex('customers')
  .select('id', 'name')
  .where({id: customer_id})
  .then((rows) => {
    if (!rows.length) {
      throw new errors.NotFound('Customer not found', {customer_id})
    }
    return rows[0]
  });
};
