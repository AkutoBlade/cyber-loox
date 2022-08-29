 const express = require("express");
 const router = express.Router();
 const app = express()
 const db = require("../config/dbconn");
 const bodyParser = require("body-parser");

 app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

//create products
router.post('/products', bodyParser.json(),
    (req, res) => {
        try {

            const bd = req.body;
            bd.totalamount = bd.quantity * bd.price;
            // Query
            const strQry =
                `
        INSERT INTO products(title, category, img, product_description, price)
        VALUES(?, ?, ?, ?, ?);
        `;
            //
            db.query(strQry,
                [bd.title, bd.category, bd.img, bd.product_description, bd.price],
                (err, results) => {
                    if (err) throw err
                    res.send(`number of affected row/s: ${results.affectedRows}`);
                })
        } catch (e) {
            console.log(`Create a new product: ${e.message}`);
        }
    });

//get products
router.get('/products', (req, res) => {
  // Query
  const strQry =
      `
  SELECT product_id, title , category, product_description, img, price, created_by FROM products;
  `;
  db.query(strQry, (err, results) => {
      if (err) throw err;
      res.json({
          status: 200,
          products: results
      })
  })
});

//get specific
router.get('/products/:product_id', (req, res) => {
  // Query
  const strQry =
      `
  SELECT product_id, title, category, product_description, img, price, created_by
  FROM products
  WHERE product_id = ?;
  `;
  db.query(strQry, [req.params.product_id], (err, results) => {
      if (err) throw err;
      res.json({
          status: 200,
          results: (results.length <= 0) ? "Sorry, no product was found." : results
      })
  })
});
// Update product
router.put('/products', (req, res) => {
  const bd = req.body;
  // Query
  const strQry =
      `UPDATE products
   SET ?
   WHERE id = ?`;

  db.query(strQry, [bd.id], (err, data) => {
      if (err) throw err;
      res.send(`number of affected record/s: ${data.affectedRows}`);
  })
});

// Delete product
router.delete('/products/:id', (req, res) => {
  // Query
  const strQry =
      `
  DELETE FROM products 
  WHERE id = ?;
  `;
  db.query(strQry, [req.params.id], (err, data, fields) => {
      if (err) throw err;
      res.send(`${data.affectedRows} row was affected`);
  })
});

 module.exports = router