const express = require('express');
const Pizza = require('../models/pizza');
const Drink = require('../models/drink');
const Order = require('../models/order');
const router = express.Router();


router.all('*', (req, res, next) =>{
  if(!req.session.manager){
    res.redirect('login')
    return;
  }
  next();
})
// renderowanie zakładki manager
router.get('/', (req, res) => {
  res.render('manager', {title:'Manager'})
});

// renderowanie zakładki Zarządzaj menu
router.get('/menu_manage', (req,res) =>{ 
  Pizza.find({}, (err,data)=>{
    res.render('manager/menu_manage', {title: 'Zarządzanie menu', data})
  });
});

  //renderowanie zakładki sprawdż zamówienia
router.get('/orders_views', (req,res) =>{
  res.render('manager/order_views/orders_views', {title: 'Podsumowanie zamówień'})
});

 //renderowanie zakładki zamów dostawę
router.get('/supply', (req,res) =>{
  res.render('manager/supply', {title: 'Zamów dostawę'})
});

//----------ŚCIEŻKI W ZAKŁADCE ZARZĄDZANIA PIZZAMI-----------

//renderowanie ścieżki 
router.get('/menu_manage/pizza', (req,res) =>{ 
  Pizza.find({}, (err,data)=>{
    res.render('manager/menu/pizza', {title: 'Zarządzanie menu', data})
  });
});

  // wyświetlanie formularza do dodania nowej pizzy
router.get('/menu_manage/pizza/add', (req,res) =>{
  res.render('manager/menu/form', {title:"dodaj pizzę", type:'addPizza'})
});

  // dodawanie nowe pizzy
router.post('/menu_manage/pizza/add', (req,res) =>{
  const name = req.body.name;
  const {ingr1, ingr2,ingr3,ingr4,ingr5} = req.body;
  const {size1, size2,size3} = req.body;
  const {price1, price2,price3} = req.body;
  const url = req.body.imgURL;

  let ingredientsTab = [];
  if(ingr1 !== ''){
    ingredientsTab.push(ingr1)
  }if(ingr2 !== ''){
    ingredientsTab.push(ingr2)
  }if(ingr3 !== ''){
    ingredientsTab.push(ingr3)
  }if(ingr4 !== ''){
    ingredientsTab.push(ingr4)
  }if(ingr5 !== ''){
    ingredientsTab.push(ingr5)
  }

  const pizzaData = new Pizza({
    name: name,
    ingredients: ingredientsTab,
    size:[size1,size2,size3],
    price: [price1,price2,price3],  
    image: url,
  });

  pizzaData.save(()=>{
    Pizza.find({}, (err,data)=>{
      res.render('manager/menu/pizza', {title: 'Manager menu', data})
    });
  })
});

//usuwanie pizzy z listy
router.get('/menu_manage/pizza/delete/:id', (req,res) =>{
  Pizza.findByIdAndDelete(req.params.id, ()=>{
  })
  Pizza.find({}, (err,data)=>{
    res.render('manager/menu/pizza', {title: 'Manager menu', data})
  });
});

// wyświetlanie formularza do zmiany konkretnej pizzy
router.get('/menu_manage/pizza/change/:id', (req,res) =>{
  Pizza.findById(req.params.id, (err,data)=>{
    res.render('manager/menu/form',{title:"zmień pizzę", type:"changePizza", data})
  });
});
    
//zapisanie zmian w konkretnej pizzy
router.post('/menu_manage/pizza/change/:id', (req,res) =>{

  const name = req.body.name;
  const {ingr1, ingr2,ingr3,ingr4,ingr5} = req.body;
  const {size1, size2,size3} = req.body;
  const {price1, price2,price3} = req.body;
  const url = req.body.imgURL;

  let ingredientsTab = [];
  if(ingr1 !== ''){
    ingredientsTab.push(ingr1)
  }if(ingr2 !== ''){
    ingredientsTab.push(ingr2)
  }if(ingr3 !== ''){
    ingredientsTab.push(ingr3)
  }if(ingr4 !== ''){
    ingredientsTab.push(ingr4)
  }if(ingr5 !== ''){
    ingredientsTab.push(ingr5)
  }

  Pizza.findByIdAndUpdate(req.params.id, 
    {name: name,
    ingredients: ingredientsTab,
    size:[size1,size2,size3],
    price: [price1,price2,price3],  
    image: url}, ()=>{
      Pizza.find({}, (err,data)=>{
      res.render('manager/menu/pizza', {title: 'Manager menu', data})
      });
    })
});

//----------ŚCIEŻKI W ZAKŁADCE ZARZĄDZANIA NAPOJAMI-----------

//renderowanie ścieżki 

router.get('/menu_manage/drink', (req,res) =>{ 
    Drink.find({}, (err,data)=>{
      res.render('manager/menu/drink', {title: 'Napoje', data})
    });
});


router.get('/menu_manage/drink/add', (req,res) =>{ 

  res.render('manager/menu/form',{title:"Dodaj napój", type:"addDrink"})
})


//dodawianie napoju
router.post('/menu_manage/drink/add', (req,res) =>{ 

  const name = req.body.name;
  const {size1, size2} = req.body;
  const {price1, price2} = req.body;
  const url = req.body.imgURL;

  const drinkData = new Drink({
    name: name,
    size:[size1,size2],
    price: [price1,price2],  
    image: url
  });
  drinkData.save(()=>{
    Drink.find({}, (err,data)=>{
      res.render('manager/menu/drink', {title: 'Napoje', data})
    });
  })
});

//usuwanie napoju z listy
router.get('/menu_manage/drink/delete/:id', (req,res) =>{
  Drink.findByIdAndDelete(req.params.id, ()=>{
  })
  Drink.find({}, (err,data)=>{
    res.render('manager/menu/drink', {title: 'Manager menu', data})
  });
});

//-------------------PODSUMOWANIE ZAMÓWIEŃ------------------------

router.get('/order_views/all', (req, res) => {
  Order.find({},(err,data)=>{
    res.render('manager/order_views/all', { title: 'Wszystkie',data});
  })
});

router.post('/order_views/all', (req, res) => {
  Order.find({},(err,data)=>{
    let dataSearch =[];
    data.forEach(el =>{
      if(el.id.substr(20).indexOf(req.body.search) !== -1){
        dataSearch.push(el)
      }
    })
    data  = dataSearch ;
    res.render('manager/order_views/all', { title: 'Wyniki wyszukiwania',data});
  })
});



router.get('/order_views/unconfirmed', (req, res) => {
  Order.find({confirmed:false},(err,data)=>{
    res.render('manager/order_views/all', { title: 'Niezatwierdzone',data});
  })
});

router.get('/order_views/unpaid', (req, res) => {
  Order.find({paidOrder:false},(err,data)=>{
    res.render('manager/order_views/all', { title: 'Niezapłacone',data});
  })
});

router.get('/order_views/all/delete/:id', (req,res) =>{
  Order.findByIdAndDelete(req.params.id, ()=>{
  })
  Order.find({}, (err,data)=>{
    res.render('manager/order_views/all', {title: 'Wszystkie', data})
  });
});

router.get('/order_views/unconfirmed/delete/:id', (req,res) =>{
  Order.findByIdAndDelete(req.params.id, ()=>{
  })
  Order.find({confirmed:false}, (err,data)=>{
    res.render('manager/order_views/all', {title: 'Niezatwierdzone', data})
  });
});

router.get('/order_views/unpaid/delete/:id', (req,res) =>{
  Order.findByIdAndDelete(req.params.id, ()=>{
  })
  Order.find({paidOrder:false}, (err,data)=>{
    res.render('manager/order_views/all', {title: 'Niezapłacone', data})
  });
});

router.get('/order_views/unpaid/change/:id', (req,res) =>{
  Order.findByIdAndUpdate(req.params.id,{paidOrder:true}, ()=>{
    Order.find({paidOrder:false}, (err,data)=>{
      res.render('manager/order_views/all', {title: 'Niezapłacone', data})
    });
  });
});

//-------------------------PODSUMOWANIA-----------------------------

//renderowanie podsumowania zamówień 
router.get('/order_views/summary', (req, res) => {
  Order.find({confirmed: true, paidOrder: true},(err,data)=>{
    let tabPizza = [];
    let tabDrink = [];
    let current = [];

    data.forEach(el => {
      el.pizza.forEach((e, index) =>{
        current.push(e);
        current.push(el.pizzaSize[index])
        current.push(el.pizzaPrice[index])
        tabPizza.push(current)
        current = []; 
      })
      el.drink.forEach((elem, index) =>{
        if(elem !== ''){
          current.push(elem);
          current.push(el.drinkSize[index])
          current.push(el.drinkPrice[index])
          tabDrink.push(current)
          current = []; 
        }
      })
    })

    let pizzaSum = 0;
    let drinkSum = 0;
    let sauceSum = 0;

    for (const el of tabPizza){
      pizzaSum += parseInt(el[2]);
    }
    for (const el of tabDrink){
      drinkSum += parseInt(el[2]);
    }
    for (const el of data){
      sauceSum += parseInt(el.soucePrice);
    }

    let allSum = pizzaSum + drinkSum + sauceSum;

    res.render('manager/order_views/summary', { title: 'Podsumowanie', tabPizza, pizzaSum, tabDrink, drinkSum, sauceSum, allSum });
  })
});

module.exports = router;
