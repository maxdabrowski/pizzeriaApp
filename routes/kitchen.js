const express = require('express');
const router = express.Router();
const Order = require('../models/order');

router.all('*', (req, res, next) =>{
  if(!req.session.kitchen){
    res.redirect('login')
    return;
  }
  next();
})

// renderowanie strony głównej 
router.get('/', (req, res) => {
  Order.find({confirmed: true, makeOrder: false},(err,data)=>{
    res.render('kitchen', { title: 'Kuchnia', data});
  })
});
  
// zmiana zamówienia na status wykonano 
router.get('/change/:id', (req,res) =>{
  Order.findByIdAndUpdate(req.params.id, 
    {makeOrder: true}, ()=>{
      Order.find({confirmed: true, makeOrder: false}, (err,data)=>{
      res.render('kitchen', {title: 'Kuchnia', data})
      });
    })
});

module.exports = router;
