const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    orders: [
        { 
            _id: { 
                type: mongoose.SchemaTypes.ObjectId,
                required: true
            },
            paymentStatus: {
                type: String,
                default: "pending"
             },
            amount : {
                type: Number,
                required: true
            },
            items: Array,
            shippingAddress: {
                name: String,
                country: String,
                line1: String,
                city: String,
                state: String,
                postalCode: String  
            },
            billingAddress: {
                name: String,
                country: String,
                line1: String,
                city: String,
                state: String,
                postalCode: String
            },
            orderStatus: {
                type: String,
                default: "pending"
            },
            createdAt: {
                timestamp: Number
            }
        }
    ]
})

module.exports = mongoose.model('Order',orderSchema)