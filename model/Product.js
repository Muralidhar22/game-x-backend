const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {type: String, required: true},
    category: {type: String, required: true},
    media: Array,
    price: Number,
    discountPrice: Number,
    discount: Number,
    esrbRating: String,
    platform: Array,
    brand: String,
    genre: Array,
    ratings: Number,
    inStock: Boolean,
    fastDelivery: Boolean
})

module.exports = mongoose.model('Product',productSchema)