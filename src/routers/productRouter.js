const express = require('express')
const router = express.Router()
const admin = require('../middleware/admin')
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
router.post('/products/:id/image',admin,upload.single('image'),async (req,res)=>{
    try{
   const product = await Product.findById(req.params.id)
   const buffer = await sharp(req.file.buffer).resize({width: 300,height:300}).png().toBuffer()
   product.image = buffer
   await product.save()
   res.send({message: 'Successful.'})
    }
    catch(e){
    res.status(500).send({error: 'Product Invalid'})
    }

},(error,req,res,next)=>{
    res.status(400).send({error: error.message})
})
router.post('/products',admin,async (req,res)=>{
    const product = new Product(req.body)
    try{
    await product.save()
    res.status(201).send(product)
    }
    catch(e){
        res.status(400).send({error: 'Invalid product.'})
    }
})

router.post('/products/remove/:id',admin,async (req,res)=>{
    console.log('I am here')
    const id = req.params.id
    console.log(id)
    try{
        const product = await Product.findByIdAndDelete(id)
        console.log(product)
        if(!product){
            res.status(404).send({error: 'Not Found'})
        }
        res.send({message: 'Successfully Deleted'})

    }
    catch(e){
        res.status(500).send()
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