const User = require('../models/user');
const jwt = require('jsonwebtoken');



module.exports ={
    isLoggedIn : (req, res, next)=>{

        if(!req.headers.authorization){
            res.status(401).json({message : 'Authentication failed'})
        }
         
    let header = req.headers.authorization || req.headers.Authorization;

    
    let token = header.split(" ")[1]

    jwt.verify(token, process.env.SECRETE_KEY, async function(err, decoded) {

        if(err){
            res.status(401).json({message : 'Authentication failed'})
        }
        
        req.user = await User.findById(decoded.userId, "fullName userName email")
       next()

      });
    }
}