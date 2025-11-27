
const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase');
const {authenticate}= require('../middleware/auth');
router.post('/create-payment',authenticate, purchaseController.purchasePremium);
router.get('/verify-payment',purchaseController.verifyPayment);
router.get('/premium', purchaseController.purchasePremium);


module.exports = router;