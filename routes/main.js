const express = require('express');
const router = express.Router();
const Password = require('../models/password');

//pobieranie strony głównej
router.get('/', (req, res) => {
  res.render('main', {title:'Strona Główna'});
});

//pobieranie strony do logowania
router.get('/login', (req, res) => {
  res.render('login', { title: 'Logowanie'});
});

//wysyłanie hasła i sprawdzanie czy istnieje w bazie haseł 
router.post('/login', (req, res) => {
  const body = req.body;
  Password.find({password: body.password}, (err,data) => {
    if(data[0] == undefined){
      res.render('login', { title: 'Logowanie', error: true});
    }else if(data[0].name == 'staff'){
      req.session.staff = 1;
      res.redirect('/staff');
    }else if (data[0].name == 'kitchen'){
      req.session.kitchen = 1;
      res.redirect('/kitchen');
    }else if (data[0].name == 'manager'){
      req.session.manager = 1;
      console.log('w managerrze')
      res.redirect('/manager');
    }
  });
});
module.exports = router;
