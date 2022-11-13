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
            required: true
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
