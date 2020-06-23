var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var voteSchema = new Schema({
  numberVotes: {type:Number, required: true},
  sumVotes: {type:Number, required: true},
  averageVotes: {type:Number, required: true},
});

module.exports = mongoose.model('Vote', voteSchema); 