const mongoose = require('mongoose') 
const { Schema } = mongoose;

const commentScheme = new Schema({
  postedId : {type : mongoose.Types.ObjectId, ref : 'Post'},
  commentedBy : {type : mongoose.Types.ObjectId, ref : 'User'},
  comment : {type : String , required : true},
  commentedAt : {type : Date, default : Date.now()}
});

module.exports = mongoose.model('Comment', commentScheme)