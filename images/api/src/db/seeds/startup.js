exports.seed = function (knex) {
  // Deletes ALL existing entries
  
  knex("phones").select("*").then((data) => {
    if(!data[0]) {
      return knex("phones").insert([
        { name: "Phone 1", brand: "Brand A" },
        { name: "Phone 2", brand: "Brand B" },
        // Add more seed data as needed
      ]);
    }
  })
};

