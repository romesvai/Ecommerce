const express = require('express')
const router = express.Router()
const auth = require('../middleware/auth')
const Product = require('../models/product')
const sharp = require('sharp')
const multer = require('multer')
const upload = multer({
    limits: 1000000,
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            cb(new Error('Please upload an image'))
        }
        cb(undefined,true)
    }
})
router.post('/products/:id/image',upload.single('image'),async (req,res)=>{
    try{
   const product = await Product.findById(req.params.id)
   debugger
   const buffer = await sharp(req.file.buffer).resize({width: 300,height:300}).png().toBuffer()
   debugger
   product.image = buffer
   debugger
   await product.save()
   debugger
   res.send()
    }
    catch(e){
    res.status(500).send()
    }

},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})
router.post('/products',async (req,res)=>{
    const product = new Product(req.body)
    try{
    await product.save()
    res.status(201).send(product)
    }
    catch(e){
        res.status(400).send()
    }
})

router.get('/products',async (req,res)=>{
    try{
    const products = await Product.find({})
    res.send(products)
    }
    catch(e){
        res.status(500).send()
    }
    
})

router.get('/products/:id/image',async (req,res)=>{
    try{
        const product = await Product.findById(req.params.id)
        if(!product || !product.image){
            throw new Error('Image not found.')
        }
        res.set('Content-Type','image/png')
        res.send(product.image)
    }
    catch(e){
        res.status(500).send()
    }

})



module.exports = router