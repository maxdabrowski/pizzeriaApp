const express = require('express');
const router = express.Router();
const Pizza = require('../models/pizza');
const Drink = require('../models/drink');
const Order = require('../models/order');

router.all('*', (req, res, next) =>{
  if(!req.session.staff){
    res.redirect('login')
    return;
  }
  next();
})
 
// renderowanie zamówień
router.get('/', (req, res) => {
    res.render('order/order_menu', {title: 'Zamówienia'})
  });

// renderowanie formularza do nowego zamówienia
router.get('/order', (req, res) => {
  Pizza.find({}, (err,dataPizza)=>{
    Drink.find({}, (err,dataDrink)=>{ 
    res.render('order/form', {title: 'Nowe zamówienie', dataDrink, dataPizza})
    });
  });
});


// dodawanie zamówienia do bazy i renderowanie zamówień
router.post('/order', (req, res) => {
  //pobranie dostępnych pizzy i napojów
  Pizza.find({}, (err,dataPizza)=>{
    Drink.find({}, (err,dataDrink)=>{

      let pizzaArray = [];
      let pizzaSizeArray = [];
      let pizzaPriceArray = [];
      let pizzaIngredientsArray = [];     
      
      //ustalanie czy w zamówienie jest jedna czy więcej sztuk, jak jedna to dodanie do tablicy
      if(typeof(req.body.pizza) == 'string'){
        pizzaArray.push(req.body.pizza)
      }else{
        pizzaArray = req.body.pizza;
      }
      
      //dla zamówionych pizzy dobranie ich rozmiarów, cen i składników
      pizzaArray.forEach((element, index) => {
        dataPizza.forEach(el =>{
          if(el.name == element){   
            pizzaSizeArray.push(el.size[req.body.pizzaSize[index]]);
            pizzaPriceArray.push(el.price[req.body.pizzaSize[index]]);
            pizzaIngredientsArray.push(el.ingredients);
          }
        });
      });

      let drinkArray = [];
      let drinkSizeArray = [];
      let drinkPriceArray = [];

      //ustalanie czy w zamówienie jest jedna czy więcej sztuk, jak jedna to dodanie do tablicy
      if(typeof(req.body.drink) == 'string'){
        drinkArray.push(req.body.drink)
      }else{
        drinkArray = req.body.drink;
      }

      //dla zamówionych napojów dobranie ich rozmiarów, cen
      drinkArray.forEach((element, index) => {
        dataDrink.forEach(el =>{
          if(el.name == element){    
            drinkSizeArray.push(el.size[req.body.drinkSize[index]]);
            drinkPriceArray.push(el.price[req.body.drinkSize[index]]);
          }
        });
      });

      //obliczanie sumy do zapłaty za pizze i napoje
      const pricesPizzaDrinkTab = pizzaPriceArray.concat(drinkPriceArray);
      let sumPizzaDrink = 0;
      for(let val of pricesPizzaDrinkTab){
        sumPizzaDrink = sumPizzaDrink + parseInt(val);
      }

      //obliczanie dopłaty za sosy powyżej 2 sztuk na pizze 
      let priceSouce = 0;
      let numberSauces = (parseInt(req.body.garlicSauce) + parseInt(req.body.tomatooSauce)) - (pizzaArray.length*2);
      if(numberSauces > 0){
         priceSouce = numberSauces * 3;
      }
      const toPay = sumPizzaDrink + priceSouce;

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

      //tworzenie szablonu zamówienia do zapisania do bazy 
      const orderData = new Order({
        customers: req.body.customers,
        table: req.body.tableNumber,
        pizza: req.body.pizza,
        pizzaSize: pizzaSizeArray,
        pizzaPrice: pizzaPriceArray,
        drink: req.body.drink,
        drinkSize: drinkSizeArray,
        drinkPrice: drinkPriceArray,    
        garlicSauce: req.body.garlicSauce,
        tomatooSauce: req.body.tomatooSauce,
        soucePrice: priceSouce,
        ingredients:pizzaIngredientsArray,
        description: req.body.description,
        impact: req.body.impact,
        toPay: toPay,
        makeOrder: false,
        paidOrder: false,
        serveOrder: false,
        confirmed: false,
        created: dateFormat,
        dataNumber:dataNumber
      });

      //zapisywanie do bazy
      orderData.save(()=>{
        Order.find({_id: orderData.id}, (err,orderData)=>{
          res.render('order/summary', {title: 'Podsumowanie zamówienia',orderData})
      });
      });
    });
  });
});


router.get('/order/paid/:id', (req, res) => {
  Order.findByIdAndUpdate(req.params.id, 
    {paidOrder:true}, ()=>{
      Order.find({_id: req.params.id}, (err,orderData)=>{
      res.render('order/summary', {title: 'Podsumowanie zamówienia', orderData})
      });
    })
});

//
router.get('/order/addOrder/:id', (req, res) => {
  Order.findByIdAndUpdate(req.params.id, 
    {confirmed:true}, ()=>{
      res.redirect('https://cessarepizza.herokuapp.com//staff/prepared')
    });
});


//---------------przełączanie między poszczególnymi zamówieniami------------------ 


//renderowanie gotowych zamówień zamówionych w lokalu 
router.get('/prepared', (req, res) => {
  Order.find({confirmed: true, makeOrder: false},(err,data)=>{
    res.render('order/orders', { title: 'W przygotowaniu',type:'Prepared', data});
  })
});

//ZAMÓWIENIA GOTOWE W LOKALU

//renderowanie gotowych zamówień zamówionych w lokalu 
router.get('/ready/local', (req, res) => {
  Order.find({confirmed: true, makeOrder: true, impact: 'lokal', serveOrder:false},(err,data)=>{
    res.render('order/orders', { title: 'Gotowe w lokalu',type:'readyLocal', data});
  })
});

//zmiana opłacenia konkretnego zamówienia z zakadki gotowe w lokalu
router.get('/ready/changePaidLocal/:id', (req, res) => {
  Order.findByIdAndUpdate(req.params.id, 
    {paidOrder: true}, ()=>{
      Order.find({confirmed: true, makeOrder: true, impact: 'lokal', serveOrder:false}, (err,data)=>{
      res.render('order/orders', {type:'readyLocal', data})
      });
    })
});

//zmiana wydania konkretnego zamówienia na wydane w lokalu 
router.get('/ready/changeReadyLocal/:id', (req, res) => {
  Order.findByIdAndUpdate(req.params.id, 
    {serveOrder:true}, ()=>{
      Order.find({confirmed: true, makeOrder: true,impact: 'lokal', serveOrder:false}, (err,data)=>{
      res.render('order/orders', {type:'readyLocal', data})
      });
    })
});


//ZAMÓWIENIA GOTOWE NA WYNOS

//renderowanie gotowych zamówień zamówionych na wynos 
router.get('/ready/takeaway', (req, res) => {
  Order.find({confirmed: true, makeOrder: true, impact: 'takeaway'},(err,data)=>{
    console.log(data)
    res.render('order/orders', { title: 'Gotowe na wynos', type:'readyTakeaway', data});
  })
});

//zmiana opłacenia konkretnego zamówienia z zakadki gotowe na wynos
router.get('/ready/changePaidTakeaway/:id', (req, res) => {
  Order.findByIdAndUpdate(req.params.id, 
    {paidOrder: true}, ()=>{
      Order.find({confirmed: true, makeOrder: true,impact: 'takeaway', serveOrder:false}, (err,data)=>{
      res.render('order/orders', {type:'readyTakeaway', data})
      });
    })
});

//zmiana wydania konkretnego zamówienia na wydane na wynos
router.get('/ready/changeReadyTakeaway/:id', (req, res) => {
  Order.findByIdAndUpdate(req.params.id, 
    {serveOrder:true}, ()=>{
      Order.find({confirmed: true, makeOrder: true,impact: 'takeaway', serveOrder:false}, (err,data)=>{
      res.render('order/orders', {type:'readyLocal', data})
      });
    })
});

//ZAMÓWIENIA NIEOPŁACONE

//renderowanie nieoplaconych zamówień 
router.get('/unpaid', (req, res) => {
  Order.find({confirmed: true, paidOrder: false},(err,data)=>{
    res.render('order/orders', {title: 'Nieopłacone',type:'unpaid', data});
  })
});

//zmiana opłacenia konkretnego zamówienia w zakładce niezapłacone
router.get('/unpaid/change/:id', (req, res) => {
  Order.findByIdAndUpdate(req.params.id, 
    {paidOrder: true}, ()=>{
      Order.find({confirmed: true, paidOrder: false}, (err,data)=>{
      res.render('order/orders', {type:'unpaid', data})
      });
    })
});

module.exports = router;
