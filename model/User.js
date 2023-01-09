const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    hashedPassword: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
      type: String,
      required: true  
    },
    address: 
            [{
                name: String,
                country: String,
                line1: String,
                city: String,
                state: String,
                postalCode: String,
                addressType: String,
                isDeliveryAddress: Boolean,
            }]

})

module.exports = mongoose.model('User',userSchema)