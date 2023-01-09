const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const verifyJWT = require('../middleware/verifyJWT');

router.route('/auth').post(userController.handleLogin)
router.get('/details',verifyJWT,userController.getUserInfo)
router.route('/address').post(verifyJWT,userController.addNewAddress)
                        .patch(verifyJWT, userController.updateAddress)
                        .delete(verifyJWT, userController.deleteAddress)

module.exports = router;