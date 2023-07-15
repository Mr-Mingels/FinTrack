exports.up = function(knex) {
    return knex.schema.createTable('budgets', function(table) {
      table.increments();
      table.integer('user_id').notNullable();
      table.string('budget_type').notNullable();
      table.integer('max_spending').notNullable();
      table.string('time_frame').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.foreign('user_id').references('id').inTable('users');
    });
};
  
exports.down = function(knex) {
    return knex.schema.dropTable('budgets');
};
  
