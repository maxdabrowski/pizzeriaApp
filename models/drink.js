var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var drinkSchema = new Schema({
  name: {type:String , required: true},
  size:{type:Array, required:true},
  price: {type:Array, required: true},
});

module.exports = mongoose.model('Drink', drinkSchema);