const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = process.env.PORT || 3001;
const cookieParser = require("cookie-parser");
const DefaultData = require("./defaultdata");
require("./db/conn");
const router = require("./routes/router");
const products = require("./models/productsSchema");
const jwt = require("jsonwebtoken");
const cors = require("cors");

// Enable CORS middleware

// app.use(cors());

// Here we cannot use * to allow all origins as we are using credentials also , this is a rule
const corsOptions = {
  origin: "http://localhost:3000",
  methods: "GET,POST",
  credentials: true, // Enable cookies across domains
};

app.use(cors(corsOptions));

// middleware
app.use(express.json());
app.use(cookieParser(""));

app.use(router);
// app.get("/",(req,res)=>{
//     res.send("your server is running");
// });

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
}

app.listen(port,"0.0.0.0", () => {
  console.log(`your server is running on port ${port} `);
});
