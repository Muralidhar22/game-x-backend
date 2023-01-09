const express = require('express');
const router = express.Router();
const productController = require('../controllers/productsController')

router.route('/').get(productController.getAllProducts)
router.route('/:productId').get(productController.getProduct)
module.exports = router;