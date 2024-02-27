const express = require('express');
const router  = express.Router()
const User = require("../../models/user")

const Auth = require('../../libs/auth');
const Follow = require('../../models/follow');



router.get('/',Auth.isLoggedIn, async(req, res)=>{
    
   return res.json({User : req.user})
  
})
router.put('/',Auth.isLoggedIn, async(req, res)=>{
    
   const {fullName, email, userName} = req.body

   let user = req.user

   if(fullName){
     user.fullName = fullName
   }
   if(email){

    let validateEmail = await User.findByOne({email})

    if(validateEmail){
        res.status(401).json({message : "User email is already in use"})
    }
     user.email = email
   }
   
   if(userName){
    let validateUserName = await User.findByOne({userName})
    if(validateUserName){
        res.status(401).json({message : "User name is already in use"})
    }
     user.userName = userName
   }

   user.save().then(()=>{
    res.json({message : "Profile updated"})
   })
  
})

router.post('/follow',Auth.isLoggedIn, async(req,res)=>{

    let {followingTo} = req.body
    let checkFollow =await Follow.findOne({followingTo, followingBy : req.user})

    if(checkFollow){
      return res.status(403).json({message : "You are already following"})
    }

    Follow.create({
      followingTo,
      followingBy : req.user
    }).then(()=>{
     return res.json({message : "You are now following"})
    })
})


router.get('/list/following',Auth.isLoggedIn, async(req,res)=>{

  let following = await Follow.find({followingBy : req.user}).populate('followingTo', 'fullName UserName email')

  return res.json({following})

})

router.get('/list/followers',Auth.isLoggedIn, async(req,res)=>{

  let following = await Follow.find({followingTo : req.user}).populate('followingBy', 'fullName UserName email')

  return res.json({following})

})

module.exports = router



