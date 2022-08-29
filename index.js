require('dotenv').config();
const express = require("express");
const cors = require("cors")
const app = express();
const router = express.Router();
const products = require("./routes/routeProduct");
const users = require("./routes/routeUser");
const cart = require("./routes/routeCart")
const PORT = process.env.PORT || 3000;

// app.use(express.static('views'));
app.set("views",app.use(express.static('views')))
app.use(products);
app.use(users);
app.use(cart)

app.get('/:type', (req, res)=> {
  res.status(404).sendFile(__dirname +'/views/404.html');
  });

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// app.use(cors({
//     origin: ['http://127.0.0.1:8080 ', 'http://localhost:8080'],
//     credentials: true
//   })); 
  
  app.use(
    router,
    express.json(),
    cors(),
    express.urlencoded({
      extended: true,
    })
  );

app.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`Server http://localhost:${PORT} is running`);
  });
