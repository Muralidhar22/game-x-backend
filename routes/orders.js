const express = require('express');
const router = express.Router();
const ordersController = require('../controllers/ordersController')

router.route('/')
    .get(ordersController.getAllOrders)
    .post(ordersController.createNewOrder)
    .patch(ordersController.updateOrderStatus)
router.route('/:orderId').get(ordersController.getOrderDetails)
    
module.exports = router;