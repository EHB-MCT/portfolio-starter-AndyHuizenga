exports.up = function (knex) {
    return knex.schema.createTable('drawings', function (table) {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('users.id').onDelete('CASCADE');
      table.json('all').notNullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function (knex) {
    return knex.schema.dropTable('drawings');
  };
  