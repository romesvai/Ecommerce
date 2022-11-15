const jwt = require('jsonwebtoken')
const User = require('../models/user')
const admin = async (req,res,next)=>{
    try{
    const token = req.header('Authorization').replace('Bearer ','')
    const decoded = jwt.verify(token,process.env.JWT_TOKEN_SECRET)
    const user = await User.findOne({_id: decoded._id, 'tokens.token': token })
    if(!user){
        throw new Error()
    }
    if(user.email === 'admin@papaya.com'){
    req.user = user
    req.token = token
    
    next()
    }
    }
    catch(e){
        res.status(401).send({message: 'Please login first.'})
    }
 

}

module.exports = admin