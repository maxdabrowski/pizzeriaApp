var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var opinionSchema = new Schema({
  opinion: {type:String , required: true},
  userName:{type:String , required: true},
  userId:{type:String , required: true},
  data:{type:String, required:true},
});

module.exports = mongoose.model('Opinion', opinionSchema);