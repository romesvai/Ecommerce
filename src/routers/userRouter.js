const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const User = require('../models/user')
const Product = require('../models/product')

router.post('/users',async (req,res)=>{
  const user = new User(req.body)
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

router.post('/users/buy/:id',auth,async (req,res)=>{
    try{
    const product = await Product.findById(req.params.id)
    if(req.user.balance < product.price){
        return res.status(403).send({error: 'Insufficient fund'})
    }
    req.user.balance = req.user.balance - product.price
    
    await req.user.save()
    res.status(201).send()
    }
    catch(e){
        res.status(400).send()
    }
})

module.exports = router
