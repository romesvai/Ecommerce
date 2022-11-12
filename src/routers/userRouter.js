const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')

router.post('/users',async (req,res)=>{
    debugger
  const user = new User(req.body)
  debugger
  try{
  await user.save()
  const token = await user.generateToken()
  res.status(201).send({user,token})
  }
  catch(e){
    res.status(400).send(e)
  }
})

router.post('/users/login',async (req,res)=>{
    try{
    const user = await User.findByCredentials(req.body.email,req.body.password)
    const token = await user.generateToken()
    if(!user){
        res.status(404).send()
    }

    res.status(201).send({user: user,token})
    }
    catch(e){
        res.status(400).send(e)
    }
})

router.post('/users/logout',auth,async (req,res)=>{
    try{
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token)
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(400).send()
    }
})

router.post('/users/logoutAll',auth,async (req,res)=>{
    try{
        req.user.tokens = []
        await req.user.save()
        res.send()
    }
    catch(e){
        res.status(400).send()
    }
})

router.get('/users/me',auth, async (req,res)=>{
   res.send(req.user)
})

router.patch('/users/me', auth ,async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name','email','password','age']
    const isValid = updates.every((property)=>{
        return allowedUpdates.includes(property)
    })

    if(!isValid){
        return res.status(400).send({error: 'Invalid Updates'})
    }
    try{
        updates.forEach((update)=>{
            req.user[update] = req.body[update]
        })
        await req.user.save()
        res.send(req.user)
    }
    catch(e){
        res.status(400).send()
    }
})

router.delete('/users/me',auth,async (req,res)=>{
    try{
    await req.user.remove()
    res.send(req.user)
    }
    catch(e){
        res.status(500).send()
    }
})

module.exports = router
