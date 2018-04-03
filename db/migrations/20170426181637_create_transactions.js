
exports.up = function(knex) {
  return knex.schema.createTable('transactions', function (table) {
    table.increments();
    table.integer('amount').notNullable();
    table.integer('from_account_id').references('id').inTable('accounts').notNullable();
    table.integer('to_account_id').references('id').inTable('accounts').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('transactions');
};
