const express = require('express');
const router = express.Router();
const wishlistController = require('../controllers/wishlistController')

router.route('/')
    .get(wishlistController.getAllWishlistItems)
    .post(wishlistController.createWishlistItem)
    .patch(wishlistController.removeWishlistItem)

module.exports = router;