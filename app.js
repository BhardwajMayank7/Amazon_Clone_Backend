// require("dotenv").config();
// const express = require("express");
// const app = express();
// const mongoose = require("mongoose");
// const port = process.env.PORT || 3001;
// const cookieParser = require("cookie-parser");
// const DefaultData = require("./defaultdata");
// require("./db/conn");
// const router = require("./routes/router");
// const products = require("./models/productsSchema");
// const jwt = require("jsonwebtoken");
// const cors = require("cors");

// // Enable CORS middleware

// // app.use(cors());

// const corsOptions = {
//   origin: "http://localhost:3000",
//   methods: "GET,POST",
//   credentials: true, // Enable cookies across domains
// };
// app.use(cors(corsOptions));

// // middleware
// app.use(express.json());
// app.use(cookieParser(""));

// app.use(router);
// // app.get("/",(req,res)=>{
// //     res.send("your server is running");
// // });

// if (process.env.NODE_ENV == "production") {
//   app.use(express.static("client/build"));
// }

// app.listen(port, () => {
//   console.log(`your server is running on port ${port} `);
// });

const express = require("express");
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Hello from the server");
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log("Listening to port 3001"));
