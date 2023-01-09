const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController')

router.route('/')
    .get(cartController.getCartItems)
    .post(cartController.addCartItem)
    .patch(cartController.updateCartItem)
    .delete(cartController.deleteCartItem)
router.route('/list')
    .delete(cartController.deleteCartList)

module.exports = router;