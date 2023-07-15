exports.up = function(knex) {
    return knex.schema.createTable('users', function(table) {
      table.increments();
      table.string('email', 255).notNullable().unique();
      table.string('username', 50).notNullable().unique();
      table.string('password', 255).notNullable();
      table.timestamp('joined').defaultTo(knex.fn.now());
    });
  };
  
exports.down = function(knex) {
    return knex.schema.dropTable('users');
};
  
  
