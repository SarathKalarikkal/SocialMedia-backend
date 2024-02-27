const mongoose = require('mongoose') 
const { Schema } = mongoose;

const userScheme = new Schema({
  fullName : String,
  userName: {type :String, required :true, unique : true}, 
  email: {type :String, required :true}, 
  password: {type :String, required :true},
  bio: String,
  profileImage: String,
});

module.exports = mongoose.model('User', userScheme)