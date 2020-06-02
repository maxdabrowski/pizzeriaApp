var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
  name: {type:String , required: true},
  password:{type:String, required:true},
  firstName:{type:String, required:true},
  lastName:{type:String, required:true},
  town:{type:String, required:true},
  street:{type:String, required:true},
  streetNumber:{type:String, required:true},
  tel:{type:String, required:true},
  mail:{type:String, required:true},
  type:{type:String, required:true},
});

module.exports = mongoose.model('User', userSchema);