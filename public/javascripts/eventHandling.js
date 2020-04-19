let delPizza = 0;
let delDrink = 0;
// obsługa dodawania kolejnego zamówienia pizzy
document.getElementById("addPizza").addEventListener('click', function(){
  delPizza = delPizza+1;
  const pizza = document.querySelector('#pizzaSelect');
  const firtstSelectPizza = document.querySelector('#firstSelectPizza');

  PizzaOptions = firtstSelectPizza.querySelectorAll('option');
  pizzaNames=[];
  PizzaOptions.forEach(element => {
    pizzaNames.push(element.value)
  });

  const div = document.createElement("div");
  const oneSelect = document.createElement("div");
  oneSelect.setAttribute('class', 'oneSelect');
  const selectForm = document.createElement('div');
  selectForm.setAttribute('class', 'selectForm');

 //elementy dla wyboru pizzy
  const labelPizza = document.createElement("label");
  const selectPizza = document.createElement("select");
  selectPizza.setAttribute('name','pizza');

 //budownie opcji wyboru rodzaju pizzy
  pizzaNames.forEach((element)=>{
    let option = document.createElement('option');
    option.setAttribute('value', element);
    option.innerText=element;
    selectPizza.appendChild(option);
  });

// elementy do wyboru rozmiaru
  const selectSize = document.createElement("select");
  const optionSize1 = document.createElement("option");
  const optionSize2 = document.createElement("option");
  const optionSize3 = document.createElement("option");
  selectSize.setAttribute('name','pizzaSize')


  const deletePizza = document.createElement("span");
  deletePizza.innerText="usuń";
  deletePizza.setAttribute('class','button delete');
  deletePizza.setAttribute('id',`delPizza${delPizza}`);
  deletePizza.setAttribute('onClick',`deleteItem('delPizza${delPizza}')`);

//tworzenie zależności DOM
  selectForm.appendChild(selectPizza);
  selectForm.appendChild(selectSize);
  selectSize.appendChild(optionSize1);
  selectSize.appendChild(optionSize2);
  selectSize.appendChild(optionSize3);
  oneSelect.appendChild(labelPizza);
  oneSelect.appendChild(selectForm);
  oneSelect.appendChild(deletePizza);

//dodawanie atrybutów 
  labelPizza.innerText="Wybierz pizzę i rozmiar:";
  optionSize1.innerText="mała";
  optionSize1.setAttribute('value',0);
  optionSize2.innerText="średnia";
  optionSize2.setAttribute('value',1);
  optionSize3.innerText="duża";
  optionSize3.setAttribute('value',2);

  pizza.appendChild(oneSelect);
  div.setAttribute('class','selectForm')
})

document.getElementById("addDrink").addEventListener('click', function(){
  delDrink = delDrink+1;
  const drink = document.querySelector('#drinkSelect');
  const firtstSelectDrink = document.querySelector('#firstSelectDrink');

  DrinkOptions = firtstSelectDrink.querySelectorAll('option');
  drinkNames=[];
  DrinkOptions.forEach(element => {
    drinkNames.push(element.value)
  });

  const div = document.createElement("div");
  const oneSelect = document.createElement("div");
  oneSelect.setAttribute('class', 'oneSelect');
  const selectForm = document.createElement('div');
  selectForm.setAttribute('class', 'selectForm');

 //elementy dla wyboru pizzy
  const labelDrink = document.createElement("label");
  const selectDrink = document.createElement("select");
  selectDrink.setAttribute('name','drink');

 //budownie opcji wyboru rodzaju pizzy
  drinkNames.forEach((element)=>{
    let option = document.createElement('option');
    option.setAttribute('value', element);
    option.innerText=element;
    selectDrink.appendChild(option);
  });

// elementy do wyboru rozmiaru
  const selectSize = document.createElement("select");
  const optionSize1 = document.createElement("option");
  const optionSize2 = document.createElement("option");
  selectSize.setAttribute('name','drinkSize')


  const deleteDrink = document.createElement("span");
  deleteDrink.innerText="usuń";
  deleteDrink.setAttribute('class','button delete');
  deleteDrink.setAttribute('id',`delDrink${delDrink}`);
  deleteDrink.setAttribute('onClick',`deleteItem('delDrink${delDrink}')`);

//tworzenie zależności DOM
  selectForm.appendChild(selectDrink);
  selectForm.appendChild(selectSize);
  selectSize.appendChild(optionSize1);
  selectSize.appendChild(optionSize2);
  oneSelect.appendChild(labelDrink);
  oneSelect.appendChild(selectForm);
  oneSelect.appendChild(deleteDrink);

//dodawanie atrybutów 
  labelDrink.innerText="Wybierz napój i rozmiar:";
  optionSize1.innerText="mały";
  optionSize1.setAttribute('value',0);
  optionSize2.innerText="duży";
  optionSize2.setAttribute('value',1);

  drink.appendChild(oneSelect);
  div.setAttribute('class','selectForm')
})

//----------------usuwanie wiersza ------------
function deleteItem(id){
document.getElementById(`${id}`).parentNode.remove();
}


