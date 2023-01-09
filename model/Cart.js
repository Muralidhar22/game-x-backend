const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            count: Number
        }
    ],
    userId: String
})

module.exports = mongoose.model('Cart',cartSchema)