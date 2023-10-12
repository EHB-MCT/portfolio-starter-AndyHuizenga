/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
    return knex.schema.createTable("phones", function (table) {
      table.increments("id").primary();
      table.string("name").notNullable();
      table.string("brand").notNullable();
      // You can add more columns as needed
      table.timestamps(true, true); // Adds 'created_at' and 'updated_at' columns
    });
  };
  
  /**
   * @param {import("knex").Knex} knex
   * @returns {Promise<void>}
   */
  exports.down = function (knex) {
    return knex.schema.dropTable("phones");
  };
  
  