const express = require("express");
const router = express.Router();
const app= express();
const path = require("path");
const db = require("../config/dbconn");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");




//Get specific user's cart
router.get('/users/:user_id/cart', (req, res) => {
    let sql = `SELECT cart FROM users WHERE user_id = ${req.params.user_id}`
    db.query(sql, (err, results) => {
      if (err) throw err
      res.json({
        status: 200,
        results: JSON.parse(results[0].cart)
      })
    })
  })
  
  //Add items to the user's specific cart
  router.post('/users/:user_id/cart', bodyParser.json(), (req, res) => {
    let bd = req.body
    let sql = `SELECT cart FROM users WHERE user_id = ${req.params.id}`
    db.query(sql, (err, results) => {
      if (err) throw err
      if (results.length > 0) {
        let cart;
        if (results[0].length == null) {
          cart = []
        } else {
          cart = JSON.parse(results[0].cart)
        }
        let product = {
          "product_id": cart.length + 1,
          "title": bd.title,
          "category": bd.category,
          "product_description": bd.product_description,
          "img": bd.img,
          "price": bd.price,
          "create_by": bd.create_by
        }
        cart.push(product)
        let sql1 = `UPDATE users SET cart = ? WHERE user_id = ${req.params.id}`
        db.query(sql1, JSON.stringify(cart), (err, results) => {
          if (err) throw results
          res.send(`Product added to your cart`)
        })
      }
    })
  });
  
  //Delete items from the specific user's cart
  router.delete('/users/:user_id/cart', bodyParser.json(), (req, res) => {
    let bd = req.body
    let sql = `UPDATE users SET cart = null WHERE user_id = ${req.params.user_id}`
    db.query(sql, (err, results) => {
      if (err) throw err
      res.send('Cart is empty')
    })
  });

   //Delete specific item
  router.delete('/users/:user_id/cart/:cart_id', (req,res)=>{
    const delSingleCartId = `
        SELECT cart FROM users
        WHERE user_id = ${req.params.user_id}
    `
    db.query(delSingleCartId, (err,results)=>{
        if(err) throw err;
        if(results.length > 0){
            if(results[0].cart != null){
                const result = JSON.parse(results[0].cart).filter((cart)=>{
                    return cart.cart_id != req.params.cart_id;
                })
                result.forEach((cart,i) => {
                    cart.cart_id = i + 1
                });
                const query = `
                    UPDATE users
                    SET cart = ?
                    WHERE user_id = ${req.params.user_id}
                `
                db.query(query, [JSON.stringify(result)], (err,results)=>{
                    if(err) throw err;
                    res.json({
                        status:200,
                        result: "Successfully deleted item from cart"
                    });
                })
            }else{
                res.json({
                    status:400,
                    result: "This user has an empty cart"
                })
            }
        }else{
            res.json({
                status:400,
                result: "There is no user with that id"
            });
        }
    })
})

module.exports=router;