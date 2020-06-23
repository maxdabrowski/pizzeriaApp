const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizza');
const Drink = require('../models/drink');
const User = require('../models/user');
const Order = require('../models/order');
const Opinion = require('../models/opinion');
const Vote = require('../models/vote');

// zapytnaie zwracające pizze w formacie json
router.get('/pizza', (req, res) => {
  Pizza.find({}, (err,data)=>{
      res.json(data)
    });
  });

//zapytnie zwracające napoje w formacie json
router.get('/drink', (req, res) => {
  Drink.find({}, (err,data)=>{
    res.json(data)
  });
});

//zapytnie opinii napoje w formacie json
router.get('/opinion', (req, res) => {
  Opinion.find({}, (err,data)=>{
    res.json(data)
  });
});

//zapytanie o głosy
router.get('/vote', (req, res) => {
  Vote.find({}, (err,data)=>{
    res.json(data)
  });
});



//sprawdzanie czy dany użytkonik już istnieje
router.post('/user_check', (req, res) => {
  const userName = req.body.name.toUpperCase().trim();
  User.find({name: userName}, (err,data)=>{  
    if(data.length  == 0){
      res.send({available: true})      
    }else{
      res.send({available: false})
    }
  });
});


//dodanie, zmiana danych użytkonika
router.post('/user', (req, res) => {
  const user = req.body.userToSend; 

  //dodanie nawego użytkowika
  if(user.type === 'NEW'){
    const newUser = new User(user);
    newUser.save(()=>{
      User.find({_id: newUser.id}, (err,data)=>{
        console.log(data)
        res.send({error: 'none', orders:[] , user:data })
      });
    });
  };

  //zmiana danych użytkownika istniejącego 
  if(user.type ==='UPDATE'){
    User.findOneAndUpdate({name:user.name},
      {password: user.password,
      firstName: user.firstName,
      lastName: user.lastName,
      town: user.town, 
      street: user.street,
      streetNumber: user.streetNumber,
      tel: user.tel,
      mail: user.mail,
      type: user.type}, ()=>{
        User.find({name: user.name}, (err,data)=>{
          Order.find({user: data[0]._id}, (err,orderData)=>{ 
            res.send({error: 'none', orders:orderData , user:data })
          });
        });
    });
  };
});

//usuwanie użytkownika
router.post('/user_delete', (req, res) => {

  User.findByIdAndDelete(req.body.id, (error)=>{});

  User.find({_id: req.body.id}, (err,data)=>{
    if(data.length  == 0){
        res.send({error:'none'})
    }else{
      res.send({error:'error'})
    }
  });
   
});

//logowanie do istniejącego konta
router.post('/login_user', (req, res) => {
  const name = req.body.name.toUpperCase().trim();
  const password = req.body.password.trim();

      User.find({name: name}, (err,userData)=>{ 
        if(userData.length  == 0){
          res.send({error:'nameError'})       
        }else{
          const userId = userData[0]._id;
          if(userData[0].password === password){

            Order.find({user: userId}, (err,orderData)=>{ 
              res.send({error: 'none', orders:orderData , user:userData })
            });

          }else{
            res.send({error:'passwordError'})
          }
        };
    });
});

//dodawanie nowego zamówienia
router.post('/order', (req, res) => {

  const pizzaArrayReq = req.body.order.pizzaOrder;
  const drinkArrayReq = req.body.order.drinkOrder;
  const sauceArray = req.body.order.sauce;
  const orderMessage = req.body.order.orderMessage; 
  const userId = req.body.order.userId;

  User.find({_id: userId}, (err,dataUser)=>{
    Pizza.find({}, (err,dataPizza)=>{

      let pizzaArray = [];
      let pizzaSizeArray = [];
      let pizzaPriceArray = [];
      let pizzaIngredientsArray = []; 
      let drinkArray = [];
      let drinkSizeArray = [];
      let drinkPriceArray = [];  
      const deliveryPrice = 5;
      const customer = dataUser[0].firstName + ' ' + dataUser[0].lastName;
      const adress = dataUser[0].town + ' ' + dataUser[0].street + ' ' + dataUser[0].streetNumber;
      const tel = dataUser[0].tel;
    
      //dodanie tabel na pizze, rozmiar i cenę
      if(pizzaArrayReq.length > 0){
        pizzaArrayReq.forEach(el =>{
          pizzaArray.push(el.pizza);
          pizzaSizeArray.push(el.size);
          pizzaPriceArray.push(el.price)
        });
      };

      //dodanie tabel na napoje, rozmiar i cenę
      if(drinkArrayReq.length > 0){
        drinkArrayReq.forEach(el =>{
          drinkArray.push(el.drink);
          drinkSizeArray.push(el.size);
          drinkPriceArray.push(el.price)
        });
      };

      //dopisanie składników do poszczególnych pizzy
      if(pizzaArray.length > 0){
        pizzaArray.forEach((element, index) => {
          dataPizza.forEach(el =>{
            if(el.name == element){   
              pizzaIngredientsArray.push(el.ingredients);
            }
          });
        });
      };
 
      //obliczanie sumy do zapłaty za pizze i napoje
      const pricesPizzaDrinkTab = pizzaPriceArray.concat(drinkPriceArray);
      let sumPizzaDrink = 0;
      for(let val of pricesPizzaDrinkTab){
        sumPizzaDrink = sumPizzaDrink + parseInt(val);
      }

      //obliczanie dopłaty za sosy powyżej 2 sztuk na pizze 
      let priceSouce = 0;
      let numberSauces = (sauceArray[0] + sauceArray[1]) - (pizzaArray.length*2);
      if(numberSauces > 0){
        priceSouce = numberSauces * 3;
      }
      const toPay = deliveryPrice  + sumPizzaDrink + priceSouce;

      //ustawienie daty zamówienia 
      const dateNow = new Date();
      const year = dateNow.getFullYear();
      const dataNumber = dateNow.getTime();
      let month = dateNow.getMonth()+1;
      let day = dateNow.getDate();
      let hour = dateNow.getHours()+2;
      let minute = dateNow.getMinutes()+1;
 
      if(month <10){
        month = '0'+month
      }
      if(day <10){
        day = '0'+day
      }
      if(hour <10){
        hour = '0'+hour
      }
      if(minute <10){
        minute = '0'+minute
      }

      const dateFormat = day+'.'+month+'.'+year + ' godz. ' + hour + ':' + minute

      //tworzenie nowego zamówienia
      const orderData = new Order({ 
        customers: customer,
        table: '',
        pizza: pizzaArray,
        pizzaSize: pizzaSizeArray,
        pizzaPrice: pizzaPriceArray,
        drink: drinkArray,
        drinkSize: drinkSizeArray,
        drinkPrice: drinkPriceArray,    
        garlicSauce: sauceArray[0],
        tomatooSauce: sauceArray[1],
        soucePrice: priceSouce,
        ingredients:pizzaIngredientsArray,
        description: orderMessage,
        impact: 'takeaway',
        toPay: toPay,
        makeOrder: false,
        paidOrder: false,
        serveOrder: false,
        confirmed: true,
        created: dateFormat,
        dataNumber:dataNumber,
        user: userId,
        telNumber: tel,
        adress: adress,
      });

      orderData.save(()=>{
        Order.find({user: userId,}, (err,orderData)=>{
          res.send({error:'none', orders:orderData})
        });
      });
    });
  });
});

router.post('/send_opinion', (req, res) => {
  const opinion = req.body; 

  //ustawienie daty zamówienia 
  const dateNow = new Date();
  const year = dateNow.getFullYear();
  let month = dateNow.getMonth()+1;
  let day = dateNow.getDate();
  let hour = dateNow.getHours()+2;
  let minute = dateNow.getMinutes()+1;

  if(month <10){
    month = '0'+month
  }
  if(day <10){
    day = '0'+day
  }
  if(hour <10){
    hour = '0'+hour
  }
  if(minute <10){
    minute = '0'+minute
  }

  const dateFormat = day+'.'+month+'.'+ year + ' godz. ' + hour + ':' + minute

  //dodanie nawej opini
    const newOpinion = new Opinion({
      opinion: opinion.opinion,
      userName: opinion.userName,
      userId: opinion.userId,
      data: dateFormat
    });
    
    newOpinion.save(()=>{
      Opinion.find({}, (err,data)=>{
        res.send(data)
      });
    });
});

//oddanie głosu
router.post('/vote', (req, res) => {
  Vote.find({}, (err,data)=>{
    const newNumberVotes = data[0].numberVotes + 1;
    const newSumVotes = data[0].sumVotes + req.body.vote;
    const averageVote = newSumVotes/newNumberVotes;

    const votes = {
      numberVotes: newNumberVotes,
      averageVotes: averageVote,
    };

    Vote.findByIdAndUpdate(data[0]._id,
      {numberVotes:newNumberVotes, sumVotes: newSumVotes, averageVotes: averageVote  }, ()=>{
      res.send(votes)
    });
  });
});

module.exports = router;