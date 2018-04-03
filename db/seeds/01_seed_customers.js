
exports.seed = function(knex) {
  // Delete all customers
  return knex('customers').del()
  .then(() => {
    return knex('customers').insert([{
      'id': 0,
      'name': 'System balance'
    }, {
      'id': 1,
      'name': 'Jane Woods'
    }, {
      'id': 2,
      'name': 'Michael Li'
    }, {
      'id': 3,
      'name': 'Heidi Hasselbach'
    }, {
      'id': 4,
      'name': 'Rahul Pour'
    }]);
  }).then(() => {
    // Update sequence counter to prevent conflicts with pregenerated ids
    return knex.raw('ALTER SEQUENCE customers_id_seq RESTART WITH 4');
  });
};
