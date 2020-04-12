var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var passwordSchema = new Schema({
  name: {type:String , required: true},
  password:{type:String, required:true},

});

module.exports = mongoose.model('Password', passwordSchema);