/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.up = function (knex) {
  
  return knex.schema.createTable("phones_brands", function (table) {
    table.increments("id").primary();
    table.string("brand_name").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists("phones_brands");
};
