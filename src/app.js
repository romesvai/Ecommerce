const path = require('path')
const express = require('express')
const hbs = require('hbs')
const staticPath = path.join(__dirname,'../public')
const viewsPath = path.join(__dirname,'../templates/views')
const partialsPath = path.join(__dirname,'../templates/partials')
const userRouter = require('../src/routers/userRouter')
const productRouter = require('../src/routers/productRouter')
const port = process.env.PORT || 3000
require('./db/mongoose.js')
const app = express()

app.set('view engine','hbs')
app.set('views',viewsPath)
hbs.registerPartials(partialsPath)


app.use(express.static(staticPath))
app.use(express.json())
app.use(userRouter)
app.use(productRouter)

app.get('/',(req,res)=>{
    res.render('index',{title: 'Home Page', name: 'Our team'})
})

app.get('/checkout',(req,res)=>{
    res.render('checkout',{title: 'About Page', name:'Our team'})
})

app.get('/login',(req,res)=>{
    res.render('login',{title: 'Login Page', name:'Our team'})
})

app.get('/register',(req,res)=>{
    res.render('register',{title: 'Login Page', name:'Our team'})
})

app.listen(port,()=>{
    console.log('Server is up')
})