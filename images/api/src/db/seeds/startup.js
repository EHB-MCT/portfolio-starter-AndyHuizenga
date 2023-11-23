exports.seed = async function (knex) {
  // Check if the phones table is empty
  const isEmpty = await knex("phones").select("*").first();

  if (!isEmpty) {
    // Do nothing if the table is not empty
    return Promise.resolve();
  }

  // Deletes ALL existing entries since the table is empty
  return knex("phones")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("phones").insert([
        { phone_model: "Test", brand_id: 1 }, // Assuming Apple has an id of 1
        { phone_model: "Phone 2", brand_id: 2 }, // Assuming Samsung has an id of 2
        // Add more seed data as needed
      ]);
    });
};
