var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var orderSchema = new Schema({
  customers:{type: String},
  table:{type: String},
  pizza:{type: Array, required: true},
  pizzaSize:{type: Array, required: true},
  pizzaPrice:{type: Array, required: true},
  drink:{type: Array, required: true},
  drinkSize:{type: Array, required: true},
  drinkPrice:{type: Array, required: true},
  garlicSauce:{type: String, required: true},
  tomatooSauce:{type: String, required: true},
  soucePrice:{type: String, required: true},
  ingredients:{type: Array, required: true},
  description:{type: String},
  created:{ type: String},
  dataNumber:{type:Number},
  impact:{type: String, required: true},
  toPay:{type: String, required: true},
  makeOrder:{type: Boolean, required: true},
  paidOrder:{type: Boolean, required: true},
  confirmed:{type: Boolean, required: true}, 
  serveOrder:{type: Boolean, required: true},
  telNumber:{type: String},
  adress:{type: String},
});

module.exports = mongoose.model('Order', orderSchema);



