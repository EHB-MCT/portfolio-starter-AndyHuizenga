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




