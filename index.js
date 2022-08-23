require('dotenv').config();
const express = require("express");
const cors = require("cors")
const app = express();
const router = express.Router();
const products = require("./routes/routeProduct");
const users = require("./routes/routeUser");
const cart = require("./routes/routeCart")
const PORT = process.env.PORT || 3000;

app.use(express.static('views'));
app.use(products);
app.use(users);
app.use(cart)

app.use(cors({
    origin: ['http://127.0.0.1:8080 ', 'http://localhost:8080'],
    credentials: true
  }));
  
  app.use(
    router,
    express.json(),
    express.urlencoded({
      extended: true,
    })
  );

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Sever http://localhost:${PORT} is running`);
  });
