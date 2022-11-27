const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        price: {
            type: Number,
            required: true,
            validate(value){
                if(value < 0){
                    throw new Error('Price must be positive.')
                }
            }
        },
        image: {
            type: Buffer
        }
    },
    {
        timestamps: true
    }
)


const Product = mongoose.model('Product',productSchema)

module.exports = Product
