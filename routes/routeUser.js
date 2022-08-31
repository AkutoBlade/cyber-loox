const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const db = require("../config/dbconn");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin","*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Access-Control-Allow-*", "*");
  next();
});

//Users
router.post('/users/register', bodyParser.json(), async (req, res) => {
    const emails = `SELECT email FROM users WHERE ?`;
    let details = {
        email: req.body.email,
    }
  
    db.query(emails, details, async (err, results) =>{
      if(results.length > 0){
     res.send("Email Exist");
    console.log(results.length)
      }else{
      let bd = req.body;
    console.log(bd);
    bd.user_password = await bcrypt.hash(bd.user_password, 10)
    bd.join_date = `${new Date().toISOString().slice(0, 10)}`;
    if (bd.user_role === '' || bd.user_role === null) {
      bd.user_role = 'user'
    }
    let sql = `INSERT INTO users (user_fullname, email, user_password, user_role, phone_number , join_date)VALUES (?, ?, ?, ?, ?, ?);`
    db.query(sql, [bd.user_fullname, bd.email, bd.user_password, bd.user_role, bd.phone_number, bd.join_date], (err, results) => {
      if (err) throw err
      else {
        res.redirect('/users/login')
      }
    })};
    })
  
  });
  
  //Login users
  router.post('/users/login',bodyParser.json(),(req,res) => {
    res.header('Access-Control-Allow-Origin','http://localhost:8080');
    res.header('Access-Control-Allow-Methods','GET, POST, OPTIONS, PUT, PATCH, DELETE');
     res.header('Access-Control-Allow-Headers','Origin,Content-Type,X-Requested-With,Accept,Authorization');
    let sql = `SELECT * FROM users WHERE email LIKE ?`
    let email = {
      email : req.body.email
    }
    db.query(sql,email.email, async (err,results) => {
      if(err) throw err
      if(results.length === 0){
        res.send(`No email found`)
      }else{
        const isMatch = await bcrypt.compare(req.body.user_password, results[0].user_password);
        if(!isMatch){
          res.send('Password is Incorrect')
        }else{
          const payload = {
            user: {
                user_fullname: results[0].user_fullname,
                email: results[0].email,
                user_password: results[0].user_password,
                user_role: results[0].user_role,
                phone_number: results[0].phone_number,
                join_date: results[0].join_date
            },
        };
        jwt.sign(payload, process.env.jwtsecret, {
            expiresIn: "365d"
        }, (err, token) => {
            if (err) throw err;
            res.json({
              msg: results,
              token
            })
            // res.status(200).send("Logged in");
        });
        }
      }
    })
  });
  
  //Specific users
  router.get('/users/:user_id', (req, res) => {
    // Query
    const strQry =
        `
    SELECT user_id, user_fullname, email, user_password, user_role, phone_number, join_date, cart
    FROM users
    WHERE user_id = ?;
    `;
    db.query(strQry, [req.params.user_id], (err, results) => {
        if (err) throw err;
        res.json({
            status: 200,
            results: (results.length <= 0) ? "Sorry, no user was found." : results
        })
    })
  });
  
  //get all users
  router.get('/users', (req, res) => {
    // Query
    const strQry =
        `
    SELECT user_id, user_fullname , email, user_password, user_role, phone_number, join_date, cart FROM users ;
    `;
    db.query(strQry, (err, results) => {
        if (err) throw err;
        res.json({
            status: 200,
            results: results
        })
        console.log(err)
    })
  });
  
  //update Or edit user
  router.put('/users/:user_id',bodyParser.json(),(req, res) => {
    const bd = req.body;
   bd.user_password =  bcrypt.hashSync(bd.user_password, 10)
    // Query
    const strQry =
        `UPDATE users
     SET user_fullname = ?, email = ?, phone_number = ?, user_password = ?
     WHERE user_id = ${req.params.user_id}`;
     
     
  
    db.query(strQry, [bd.user_fullname, bd.email, bd.phone_number,  bd.user_password], (err, data) => {
        if (err) throw err;
        res.send(`number of affected record/s: ${data.affectedRows}`);
    })
  });
  
  //Delete a specific user
  router.delete('/users/:user_id', (req, res) => {
    // Query
    const strQry =
        `
    DELETE FROM users
    WHERE user_id = ?;
    `;
    db.query(strQry, [req.params.user_id], (err, data, fields) => {
        if (err) throw err;
        res.send(`${data.affectedRows} row was affected`);
    })
  });




module.exports = router