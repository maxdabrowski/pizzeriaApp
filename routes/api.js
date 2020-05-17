const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizza');
const Drink = require('../models/drink');

// zapytnaie zwracające pizze w formacie json
router.get('/pizza', (req, res) => {
  Pizza.find({}, (err,data)=>{
      res.json(data)
    })
  });
//zapytnie zwracające napoje w formacie json
router.get('/drink', (req, res) => {
  Drink.find({}, (err,data)=>{
    res.json(data)
  })
})


//obsługa Api dla reacta......................................

router.post('/react', (req, res) => {

  console.log(req.body);
  res.send(`przysłane Body ${req.body.post}`)
});

router.get('/react', (req, res) => {

  res.send({express:'Hello From Express'})
});


//....................................................................................................








module.exports = router;