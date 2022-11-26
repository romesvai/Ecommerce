const express = require('express')
const auth = require('../middleware/auth')
const User = require('../models/user')
const gateway = require('../payment/payment')
const router = express.Router()


router.get('/users/me/payment/getBraintreeToken',auth,(req,res)=>{
    try{
    gateway.clientToken.generate({
      }, (err, response) => {
        if(response){
        const clientToken = response.clientToken
        return res.send({token: clientToken})
        }
        res.status(500).send(err)
      })
    }
    catch(e){
        res.status(500).send({error: 'Something went wrong.'})
    }
})

router.post('/users/me/payment/checkout',auth, (req,res)=>{
    gateway.transaction.sale({
        amount: req.body.price,
        paymentMethodNonce: req.body.nonce,
        options: {
          submitForSettlement: true
        }
      }, (err, result) => {
        if(!result){
            return res.status(500).send({error: 'Something went wrong.'})
        }
        res.status(201).send({message: 'Succesful purchase.'})
      });
})

module.exports = router