const mongoose = require("mongoose");
require('dotenv').config();

const DB = process.env.DATABASE;

mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("connection is successfully done"))
  .catch((error) => console.log("mongodb connection issue" + error.message));
