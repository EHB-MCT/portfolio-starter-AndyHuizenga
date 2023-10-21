exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex("phones")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("phones").insert([
        { name: "Phone 1", brand: "Brand A" },
        { name: "Phone 2", brand: "Brand B" },
        // Add more seed data as needed
      ]);
    });
};

