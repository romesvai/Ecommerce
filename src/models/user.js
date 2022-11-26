const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Product = require('./product')

const userSchema = mongoose.Schema(
    {
        name : {
            type: String,
            required: true,
            trim: true
        },
        age: {
            type: Number,
            default: 0,
            validate(value){
                if(value < 0){
                    throw new Error('Age must be a positive number')
                }
            }
        },
        email: {
            type: String,
            unique: true,
            validate(value){
                if(!validator.isEmail(value)){
                    throw Error('Please a valid email.')
                }
            },
            required: true,
            trim: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            trim: true,
            validate(value){
                if(value.length<6){
                    throw new Error('Length must be greater than 6')
                }
                else if(value.toLowerCase().includes('password')){
                    throw new Error('Password cannot contain password')
                }
            }
    
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true
                }
            }
        ],
        cart: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product'
                }
            }
        ]
    },
    {
        timestamps: true
    }
)

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Invalid Login')
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Invalid Login')
    }
    return user

}
userSchema.methods.generateToken = async function(){
    const user = this 
    const token = jwt.sign({_id: user._id.toString()},process.env.JWT_TOKEN_SECRET)
    user.tokens = user.tokens.concat({token})
    await user.save()
    return token
}

userSchema.methods.toJSON = function(){
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    return userObject
}
userSchema.pre('save',async function(next){
    const user = this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

const User = mongoose.model('User',userSchema)

module.exports = User