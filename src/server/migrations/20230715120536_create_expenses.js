exports.up = function(knex) {
    return knex.schema.createTable('expenses', function(table) {
      table.increments();
      table.integer('user_id').notNullable();
      table.string('expense_type').notNullable();
      table.integer('expense_amount').notNullable();
      table.string('expense_description').notNullable()
      table.timestamp('expense_date').defaultTo(knex.fn.now());
      table.foreign('user_id').references('id').inTable('users');
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('expenses');
};
  
