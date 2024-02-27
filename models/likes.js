const mongoose = require('mongoose') 
const { Schema } = mongoose;

const likesScheme = new Schema({
  postedId : {type : mongoose.Types.ObjectId, ref : 'Post'},
  likedBy : {type : mongoose.Types.ObjectId, ref : 'User'},
  likedAt : {type : Date, default : Date.now()}
});

module.exports = mongoose.model('Like', likesScheme)