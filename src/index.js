const express = require("express");
const knex = require("knex");
const app = express();
require('dotenv').config();

const knexfile = require("../knexfile");
const port = process.env.PORT || 3000;
app.use(express.json());

app.listen(port, () => {
  console.log("up and running")
})
console.log("port is running")


//Hello world - status: worked 
app.get("/", (request,response ) =>{
  response.send("hello world")

})

const db = knex(knexfile.development);

// // Run pending migrations
// db.migrate.latest()
//   .then(() => {
//     // Migration succeeded; start the server
//     app.listen(port, (err) => {
//       if (!err) {
//         console.log("Server is running on port " + port);
//       } else {
//         console.log(err);
//       }
//     });
//   })
//   .catch((error) => {
//     console.error("Error running migrations:", error);
//     process.exit(1); // Exit the application on migration error
//   });


// db("schema_name.students").select("*")

// // Read all phones
// app.get("/api/phones", (request, response) => {
//   db("phones")
//     .select("*")
//     .then((phones) => {
//       response.json(phones);
//     })
//     .catch((error) => {
//       response.status(500).json({ error: "Error fetching phones" });
//     });
// });

app.get("api/phones", (request, response) => {
  db.select()
    .from("phones")
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    });
});

app.get("/phones", (request, response) => {
  db.select()
    .from("phones")
    .then((data) => {
      response.json(data);
    })
    .catch((error) => {
      console.error(error);
      response.status(500).json({ error: "Internal server error" });
    });
});

// Update a phone by ID
app.put("/api/phones/:id", (request, response) => {
  const { id } = request.params;
  const { name, brand } = request.body;

  db("phones")
    .where({ id })
    .update({ name, brand })
    .returning("*")
    .then((updatedPhone) => {
      if (updatedPhone.length === 0) {
        response.status(404).json({ error: "Phone not found" });
      } else {
        response.json(updatedPhone);
      }
    })
    .catch((error) => {
      console.error("Error updating phone:", error);
      response.status(500).json({ error: "Error updating phone" });
    });
});







