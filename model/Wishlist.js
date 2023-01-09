const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
    items: Array,
    userId: String
})

module.exports = mongoose.model('Wishlist',wishlistSchema)