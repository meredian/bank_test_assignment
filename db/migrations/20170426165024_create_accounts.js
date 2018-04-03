
exports.up = function(knex) {
  return knex.schema.createTable('accounts', function (table) {
    table.increments();
    table.integer('balance').notNullable();
    table.integer('customer_id').references('id').inTable('customers').notNullable();
  });
  
};

exports.down = function(knex) {
  return knex.schema.dropTable('accounts');
};
