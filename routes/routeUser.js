const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const db = require("../config/dbconn");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// app.use((req, res, next) => {
//   res.setHeader("Access-Control-Allow-Origin","*");
//   res.setHeader("Access-Control-Allow-Methods", "*");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//   res.setHeader("Access-Control-Allow-*", "*");
//   next();
// });
// app.use(
//   cors({
//     mode: 'no-cors',
//     origin: ["http://localhost:8080/", "http://127.0.0.1:8080"],
//     credentials: true,
//   })
// );
//Users




module.exports = router