/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  return knex.schema.createTable("phones", function (table) {
    table.increments("id").primary();
    table.string("phone_model").notNullable();
    table.integer("brand_id").unsigned();
    table.foreign("brand_id").references("phones_brands.id");
    table.timestamps(true, true);
  });
  };
  
  /**
   * @param {import("knex").Knex} knex
   * @returns {Promise<void>}
   */
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists("phones");
  };
  