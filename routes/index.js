const express = require('express');
const router = express.Router();
const login = 'admin';
const password = '123';


router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

router.get('/login', (req, res) => {
  res.render('login', { title: 'Login' });
});

router.post('/login', (req, res) => {
  console.log(req.body.login);
  console.log(req.body.password);
 const body = req.body;
  if(body.login === login && body.password === password){
    req.session.admin = 1;
    res.redirect('/admin');
  }else{
    res.redirect('/login');
  }
});

module.exports = router;
