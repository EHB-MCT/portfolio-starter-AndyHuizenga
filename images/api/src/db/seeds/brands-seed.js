exports.seed = async function (knex) {
    // Check if the phones_brands table is empty
    const isEmpty = await knex("phones_brands").select("*").first();
  
    if (isEmpty) {
      // Inserts seed entries since the table is empty
      return knex("phones_brands").insert([
        { brand_name: "Apple" },
        { brand_name: "Samsung" },
        { brand_name: "LG" },
        { brand_name: "Google Pixel" },
      ]);
    }
  
    // Do nothing if the table is not empty
    return Promise.resolve();
  };
  