var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var pizzaSchema = new Schema({
  name: {type:String , required: true},
  ingredients: {type:Array , required: true},
  size:{type:Array, required:true},
  price: {type:Array, required: true},
});

module.exports = mongoose.model('Pizza', pizzaSchema);