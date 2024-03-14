const express = require('express');
const User = require('../../models/user');
const router  = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config()



router.post('/register', async(req, res)=>{

    console.log("req", req.body);
   
    const {fullName, userName, email, password} = req.body

   let user = await User.findOne({}).or([{userName}, {email}])
   
   if(user){
    return res.status(400).json({message : "Username or email is already in use!"})
   }else{

   bcrypt.hash(password, 10, function(err, hash) {

    User.create({
        fullName,
        userName,
        email,
        password : hash
    }).then(()=>{
        return res.json({message : "User regisered successlly"})
    }).catch((err)=>{
        res.status(400).json({message : err.message})
    })

    })
    
   }

})

router.post('/login', async(req,res)=>{

    const {email, password} = req.body

    let user = await User.findOne({}).or([{userName : email}, {email}])
    
   if(user){
    bcrypt.compare(password, user.password, function(err, result){
        
         if(result){
            var token = jwt.sign({userId : user._id}, process.env.SECRETE_KEY);
            res.json({message : "Login successfull", token})
         }else{
            return res.status(400).json({message : "Invalid user name or password"})
         }
    })
   }else{
    return res.status(400).json({message : "Invalid user name or password"})
   }

})



module.exports = router



