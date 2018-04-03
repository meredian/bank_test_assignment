
exports.seed = function(knex) {
  // Delete all customers
  return knex('accounts').del()
  .then(() => {
    return knex('accounts').insert([{
      'id': 0,
      'balance': 0,
      'customer_id': 0,
    }]);
  });
};
