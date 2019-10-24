const express = require('express');
const router = express.Router();
const Quiz = require('../models/quiz');


/* GET home page. */
router.get('/', (req, res) => {
  const show = !req.session.vote;
console.log(show)
  Quiz.find({},(err,data)=>{
    let sum =0; 
    data.forEach((item) =>{
      sum += item.vote;
    })
    res.render('quiz', { title: 'Quiz', data, show, sum });
  })
});
  
  router.post('/', (req, res) => {
    const id = req.body.quiz;
console.log(req.body)
    Quiz.findOne({_id: id},(err,data)=>{
      data.vote = data.vote + 1; 

      data.save((err) => {
        req.session.vote = true;
        res.redirect('/quiz');

      }); 
    });
  });

module.exports = router;
