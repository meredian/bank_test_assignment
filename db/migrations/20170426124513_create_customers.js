
exports.up = function(knex) {
  return knex.schema.createTable('customers', function (table) {
    table.increments();
    table.string('name');
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('customers');
};
